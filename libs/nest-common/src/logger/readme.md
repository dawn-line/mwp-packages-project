## log 

### 配置

```yaml
logger:
  level: 'info' # 日志级别 info, error, warn, debug, verbose
  timestamp: true # 是否开启时间戳
  disableConsoleAtProd: false # 是否在生产环境禁用控制台日志
  maxFileSize: '2m' # 单个日志文件最大大小
  maxFiles: '30' # 日志文件最大数量
  appLogName: 'web.log' # 应用日志名称
  errorLogName: 'error.log' # 错误日志名称
  dir: './logs' # 日志文件存储目录
```

### 使用

> logger 服务注入方式,logger模块在nest-cloud中已经全局注册，可以直接注入使用 


```typescript
import { LoggerService } from '@cs/nest-common';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}
} 
``` 

> 使用logger.service 提供的日志方法


> 方法说明

```typescript
// 接受消息和可选的上下文
log(message: any, context?: string): void;

// 接受消息和任意数量的参数，最后一个如果时字符串是上下文
log(message: any, ...optionalParams: [...any, string?]): void;

// 实际的方法实现，处理所有重载情况
log(message: any, ...optionalParams: any[]): void;

```

> 使用实例：

```typescript
// 只传消息
logger.log('用户登录成功');

// 传消息和上下文
logger.log('用户登录成功', 'context');

//  传递多个参数(最后一个参数如果是字符串是上下文)
logger.log('用户登录成功', { userId: 123 });
logger.log('用户登录成功', { userId: 123 }, 'AuthService');



```

> 日志级别

- info 信息
- error 错误
- warn 警告
- debug 调试
- verbose 详细

> 日志文件存储目录

- 默认存储在项目根目录下的logs文件夹中
- 可以通过配置修改存储目录  

> 日志文件命名

- 默认的日志文件名是app.log，错误日志文件名是error.log
- 可以通过配置修改日志文件名
  


