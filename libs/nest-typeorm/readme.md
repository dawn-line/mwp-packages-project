# @cs/nest-typeorm


## 简介

`@cs/nest-typeorm` 是一个基于 NestJS 和 TypeORM 的数据库 ORM 封装库，专为 MySQL 数据库优化。该库提供了简化的数据库连接管理、实体注册、基础实体类型以及通用服务层实现，使开发者能够轻松地在 NestJS 应用中与 MySQL 数据库进行交互。

## 特性

- 多数据库连接支持（同步与异步配置）
- 集中式实体注册机制
- 丰富的基础实体类（支持基础审计字段、树形结构等）
- 通用 CRUD 服务抽象
- 软删除支持
- 自动版本控制
- 基础的树形结构支持

## 安装

```bash
npm install @cs/nest-typeorm
```



## 使用指南

### 1. 配置模块

#### 同步配置

```typescript
import { DatabaseModule } from '@cs/nest-typeorm';

@Module({
  imports: [
    DatabaseModule.forRoot({
      default: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'db_name',
        synchronize: false,
        logging: true,
        name: 'default'
      },
      // 可以配置多个数据库连接
      second_db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'second_db',
        synchronize: false,
        logging: true,
        name: 'second_db'
      }
    })
  ]
})
export class AppModule {}

```

#### 异步配置

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@CSModule({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'test',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(111, config.get('mysql')[0]);
        return {
          ...config.get('mysql').test,
          entities: [User],
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'test1',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(222, config.get('mysql'));
        return {
          ...config.get('mysql').test1,
          entities: [Role],
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class ShareModule {}
```

### 2. 实体注册

有两种方式注册实体：

#### 自动注册（推荐）

使用 `entity.registry.ts` 中提供的 `registerEntity` 函数：

```typescript
import { registerEntity } from '@cs/nest-typeorm';
import { Entity, Column } from 'typeorm';
import { HasPrimaryFullEntity } from '@cs/nest-typeorm';

@Entity('user')
export class UserEntity extends HasPrimaryFullEntity {
  @Column()
  username: string;
  
  @Column()
  email: string;
}

// 注册实体到指定连接
registerEntity('default', UserEntity);
```

#### 手动注册模块

使用 `DatabaseModule.forFeature` 方法：

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forFeature({
      connectionName: 'default',
      entities: [UserEntity]
    })
  ]
})
export class UserModule {}
```

#### 批量注册多个实体到不同连接

使用 `DatabaseModule.forFeatures` 方法：

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [
    DatabaseModule.forFeatures([
      {
        connectionName: 'default',
        entities: [UserEntity]
      },
      {
        connectionName: 'second_db',
        entities: [ProductEntity]
      }
    ])
  ]
})
export class AppEntitiesModule {}
```

### 3. 基础实体类

该库提供了多种基础实体类，可以根据需求选择合适的基类：

#### BaseEntity（基础审计实体）

包含基本审计字段：

- `createdAt`: 创建时间
- `creatorId`: 创建用户ID
- `creatorName`: 创建用户名称
- `modifierAt`: 最后修改时间
- `modifierId`: 修改用户ID
- `modifierName`: 修改用户名称
- `isRemoved`: 删除标识
- `version`: 版本号

#### HasEnableEntity（支持启用/禁用的实体）

继承自 `BaseEntity`，额外包含：

- `sortCode`: 排序码
- `isEnable`: 是否启用

#### HasPrimaryEntity（带主键的基础实体）

继承自 `BaseEntity`，额外包含：

- `id`: 主键

#### HasPrimaryFullEntity（完整功能实体）

继承自 `HasEnableEntity`，额外包含：

- `id`: 主键

#### TreeEntity（树形结构实体）

继承自 `BaseEntity`，支持树形结构：

- `parentId`: 父节点ID
- `fullId`: ID全路径
- `fullName`: 名称全路径
- `level`: 层级
- `isLeaf`: 是否叶子节点

#### HasEnableTreeEntity（支持启用/禁用的树形实体）

继承自 `TreeEntity`，额外包含：

- `sortCode`: 排序码
- `isEnable`: 是否启用

#### HasPrimaryTreeEntity（带主键的树形实体）

继承自 `TreeEntity`，额外包含：

- `id`: 主键

#### HasPrimaryFullTreeEntity（完整功能树形实体）

继承自 `HasEnableTreeEntity`，额外包含：

- `id`: 主键

### 4. 通用服务类 (SingleService)

提供基础的 CRUD 操作，可以继承并扩展：

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SingleService } from '@cs/nest-typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService extends SingleService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super(userRepository);
  }
  
  // 可以添加自定义业务方法
  async findByUsername(username: string): Promise<UserEntity> {
    return this.findOne({ username });
  }
}
```

### 服务方法

SingleService 提供以下方法：

#### 查询操作

- `findOne(dto: Partial<T>)`: 根据条件查询单个实体
- `findMany(dto: Partial<T>, take?: number, skip?: number)`: 根据条件查询多个实体
- `findManyBase<T>(queryConditionInput: QueryConditionInput)`: 高级查询，支持复杂条
件和分页

findManyBase参数详细说明如下：

> 该方法按照`QueryConditionInput`实体的条件属性对结果集进行查询；

- 参数实体：
```js
export class QueryConditionInput {
  tableName?: string;  // 表别名 eg: "tableName":"user"
  select?: string[];  // 如果传入了tablename，在select属性中必须以前缀方式访问 eg: "select":["user.id","user.userName"]  注意：属性名访问必须转化为小驼峰风格；
  conditionLambda: string; //查询条件 eg："user.firstName = :firstName and userName like %:userName%" 注意：属性名访问必须转化为小驼峰风格；
  conditionValue: object;  //查询条件的参数变量  eg：{ firstName: "Timber", userName: "mlc" }
  orderBy?: OrderByCondition;  // 排序条件  eg:{"user_name":"asc","id":"asc"}  注意此处的属性为数据库字段格式，不是小驼峰格式。
  skip?: number; // 跳过的条目数  该属性存在时会返回分页格式的结果
  take?: number;  // 获取结果集的条目数  0为不限制
}
```

#### 修改操作

- `saveOne(entity: DeepPartial<T>)`: 保存单个实体
- `saveMany(entities: DeepPartial<T>[])`: 批量保存多个实体
- `updateByCondition(updateData: Partial<T>, conditions: Partial<T>)`: 根据条件更新

#### 删除操作

- `softDelete(conditions: Partial<T>)`: 软删除
- `hardDelete(conditions: Partial<T>)`: 硬删除

#### 其他操作

- `executeSql(querySql: string, parameters?: Record<string, any>)`: 执行原生 SQL

## 最佳实践

1. 使用 `registerEntity` 自动注册实体
2. 选择适合业务需求的基础实体类
3. 继承 `SingleService` 实现业务服务
4. 使用软删除替代硬删除（设置 `isRemoved = true`）
5. 利用版本控制字段处理并发

## 注意事项

1. 实体必须先注册才能被 TypeORM 识别
2. 对于多数据库连接，确保在使用前正确指定连接名称

## 示例

### 完整的实体定义和服务示例

```typescript
// user.entity.ts
import { Entity, Column } from 'typeorm';
import { HasPrimaryFullEntity, registerEntity } from '@cs/nest-typeorm';

@Entity('user')
export class UserEntity extends HasPrimaryFullEntity {
  @Column({ length: 50 })
  username: string;
  
  @Column({ length: 100 })
  email: string;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  avatar: string;
}

// 自动注册实体
registerEntity('default', UserEntity);

// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SingleService } from '@cs/nest-typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends SingleService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super(userRepository);
  }
  
  async createUser(userData: Partial<UserEntity>): Promise<number> {
    // 生成ID（在实际应用中可能使用UUID或其他ID生成方式）
    userData.id = Date.now().toString();
    
    // 设置审计信息（实际应用中可能从当前用户上下文获取）
    userData.creatorId = '1';
    userData.creatorName = 'admin';
    
    return this.saveOne(userData);
  }
  
  async getUsersByStatus(isEnable: boolean): Promise<UserEntity[]> {
    return this.findMany({ isEnable, isRemoved: false });
  }
  
  async disableUser(id: string): Promise<number> {
    return this.updateByCondition(
      { isEnable: false, modifierId: '1', modifierName: 'admin' },
      { id }
    );
  }
  
  async deleteUser(id: string): Promise<number> {
    return this.softDelete({ id });
  }
}

// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '@cs/nest-typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    DatabaseModule.forFeature({
      connectionName: 'default',
      entities: [UserEntity]
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

