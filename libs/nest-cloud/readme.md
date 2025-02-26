### nest-cloud
该库主要提供了服务的启动方法、服务注册、服务间远程调用方法。

#### 异常处理

当服务中需要抛出异常时，需要判断属于那种异常，一般在提供给站点的控制器中抛出`HttpException`异常，在服务中一般抛出`RpcException`异常。


抛出rpc异常的示例

```ts
import { RpcException, RpcErrorCode } from '@cs/nest-cloud';

//... 服务上下文
throw new RpcException('error message', RpcErrorCode.INTERNAL_ERROR);

```

抛出http异常的示例

```ts
import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

//... 站点控制器
throw new HttpException('error message', HttpStatus.INTERNAL_ERROR);

```

> 一般所有的错误都会在异常过滤器中被接受并被格式化处理。想要查看比较详细的错误，可以更改异常过滤器的配置来收集错误。

```yaml
  exceptionFilter:  # 异常过滤器
    stack: 
      response: false # 是否在响应打印堆栈信息 （默认不开启）
      logger: true # 是否在日志中打印堆栈信息 （默认开启）
```



---

### rpc模块

RPC模块提供了服务间远程调用的能力，基于HTTP协议和json-rpc2.0规范协议实现，支持服务发现、负载均衡等特性。

#### 1. 安装和配置


> 在@csmodule模块装饰器中以默认全局导入了rpcModule，无需单独引入。


单独使用时在应用模块中导入RpcModule：

```typescript
import { RpcModule } from '@cs/nest-cloud';

@Module({
  imports: [
    RpcModule.forRoot({
      timeout: 5000,         // 请求超时时间(ms)
      protocol: 'http',      // 协议，支持http/https
    }),
  ],
})
export class AppModule {}
```

#### 2. 创建RPC服务

```ts
import { RpcService, RpcMethod } from '@cs/nest-cloud';

@RpcService('userService')
export class UserService {
  @RpcMethod('getUserById')
  async getUserById(userId: string) {
    // 实现获取用户逻辑
    return { id: userId, name: 'John Doe' };
  }

  @RpcMethod('createUser')
  async createUser(userData: any) {
    // 实现创建用户逻辑
    return { success: true };
  }
}
```

#### 2. 调用RPC服务 



在服务中注入RpcClient：

```typescript
import { RpcClient } from '@cs/nest-cloud';

@Injectable()
export class YourService {
  constructor(private readonly rpcClient: RpcClient) {}

  async callRemoteService() {
  
    const result = await this.rpcClient.call({
      rpcConfig:{
       serviceName: 'remote-service',    // 目标服务名称
       groupName: 'default',    // 目标服务组名 可以省略
       cluster: 'cluster1',    // 目标服务集群 可以省略
       servicePath: '/sessionServer',    // 目标服务路径 可以省略
      },
      payload:{
        method: 'session.setSession',  // 调用方法 一般为服务名.方法名
        params: ['11111', { name: '1111' }], // 参数 
        isNotify: false, // 没有包含“id”成员的请求对象为通知， 作为通知的请求对象表明客户端对相应的响应对象并不感兴趣，本身也没有响应对象需要返回给客户端。服务端必须不回复一个通知，该参数默认不传
      },
      reqOptions:{
        // axiosConfig   可省略 改变超时 请求的headers等
      }
    });

  }
}
```


实现rpc方法时，需要对服务、方法和参数进行标注才能注入到注册列表中，以便其他服务调用。在`@cs/nest-cloud`包中实现了`RpcService`、`RpcMethod`、`RpcParam`三个装饰器，用于标注服务、方法和参数。

> 除了服务名称、方法名称、参数名称强制要求外，其他描述信息主要作用于服务文档展示,方便开发人员了解服务接口的用途和参数含义,在服务中可在浏览器通过访问`<服务地址>/rpc`查询服务文档。

示例如下：
```ts
@RpcService({
  name: 'userService',
  description: '用户相关服务，包括身份验证和用户信息管理'
})
export class UserService {
  @RpcMethod({
    name: 'validateServiceTicket',
    description: '验证服务票据的有效性',
    returnType: 'boolean',
    returnDescription: '票据验证结果，true表示有效，false表示无效'
  })
  async validateServiceTicket(
    @RpcParam({
      name: 'ticket',
      description: '服务票据',
      type: 'string',
      required: true
    })
    ticket: string,
    
    @RpcParam({
      name: 'service',
      description: '请求服务的URL',
      type: 'string',
      required: true
    })
    service: string,
    
    @RpcParam({
      name: 'renew',
      description: '是否强制重新认证',
      type: 'boolean',
      required: false,
      defaultValue: false
    })
    renew?: boolean,
    
    @RpcParam({
      name: 'format',
      description: '返回数据格式',
      type: 'string',
      required: false,
      defaultValue: 'JSON'
    })
    format: 'JSON' | 'XML' = 'JSON',
  ) {
    // 方法实现...
    return true;
  }
}
```



> 参数传递的几种支持的方式

空参数：

```ts
// 不传任何参数
{
  "method": "service.method"
}
// 或显式传 null/undefined
{
  "method": "service.method",
  "params": null 
}
```
单个值参数：

```ts
// 直接传递单个值
{
  "method": "service.method",
  "params": "some value"
}
```
对个参数时可以按照数组或者对象形式传递参数
如下：


数组形式参数：


```ts
// 按顺序传递多个参数
{
  "method": "service.method", 
  "params": ["test", 18, "beijing"]
}
```

对象形式参数（命名参数）：

```ts
// 通过参数名传递
{
  "method": "service.method",
  "params": {
    "name": "test",
    "age": 18,
    "address": "beijing"
  }
}
```

- 对象形式传参时，参数名必须与方法定义的参数名完全匹配
- 数组形式传参时，参数数量不能超过方法定义的参数数量
- 参数验证失败会抛出 RpcInvalidParamsException 异常

---


#### 服务启动

服务启动提供了方法`bootstrap`方法。该方法提供了三个参数：
- rootMoule 为服务的根模块，将根模块传入启动函数
- appStartCall 启动方法的回调方法。


使用示例

```ts

export async function bootstrap(
  rootModule: any, // 加载根模块
  appStartCall?: AsyncFunction, // 启动中间回调
) {}

```
---
