# 使用InjectRepository装饰器

本文档演示如何使用`InjectRepository`装饰器简化仓库注入过程。

## 基本用法

### 1. 定义实体和仓库

首先，定义实体和自定义仓库：

```typescript
// user.entity.ts
import { Entity, Column } from 'typeorm';
import { registerEntity, HasPrimaryFullEntity } from '@cs/nest-typeorm';

@Entity('sys_user')
export class UserEntity extends HasPrimaryFullEntity {
  @Column({ name: 'username', type: 'varchar', length: 50 })
  username: string;
  
  // 其他字段...
}

// 注册实体到指定连接
registerEntity('test', UserEntity);
```

```typescript
// user.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@cs/nest-typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  // 自定义方法...
  async findByUsername(username: string): Promise<UserEntity> {
    return this.findOne({ username });
  }
}
```

### 2. 使用InjectRepository装饰器

使用装饰器注入仓库，省去手动创建:

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@cs/nest-typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  // 使用装饰器注入仓库，同时指定连接名
  @InjectRepository(UserEntity, UserRepository, 'test')
  private readonly userRepository: UserRepository;

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findByUsername(username);
  }
  
  // 其他业务方法...
}
```

### 3. 配置模块

有两种方式配置模块：

#### 方式一：使用TypeOrmRepositoryModule装饰器

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmRepositoryModule } from '@cs/nest-typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@TypeOrmRepositoryModule()
@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // 注册仓库提供者
    {
      provide: getRepositoryToken(UserEntity, UserRepository),
      useFactory: (dataSourceManager: DataSourceManagerImpl) => {
        return dataSourceManager.getCustomRepository(
          UserEntity,
          UserRepository,
          'test',
        );
      },
      inject: [DataSourceManagerImpl],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
```

#### 方式二：使用RepositoryDynamicModule.forRepositories()

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { RepositoryDynamicModule } from '@cs/nest-typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    // 动态注册仓库
    RegistModule.forRepositories([
      {
        entity: UserEntity,
        repository: UserRepository,
        connectionName: 'test',
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 更简洁的模块配置

如果你有多个仓库需要注入，可以使用`RepositoryDynamicModule`的方式更加简洁：

```typescript
// repositories.ts
import { UserEntity, UserRepository } from './user';
import { PostEntity, PostRepository } from './post';
import { CategoryEntity, CategoryRepository } from './category';

// 集中定义所有仓库配置
export const REPOSITORIES = [
  {
    entity: UserEntity,
    repository: UserRepository,
    connectionName: 'test',
  },
  {
    entity: PostEntity,
    repository: PostRepository,
    connectionName: 'test',
  },
  {
    entity: CategoryEntity,
    repository: CategoryRepository,
    connectionName: 'test',
  },
];
```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule, RepositoryDynamicModule } from '@cs/nest-typeorm';
import { REPOSITORIES } from './repositories';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    // 配置数据库连接
    DatabaseModule.forRootAsync({...}),
    
    // 一次性注册所有仓库
    RepositoryDynamicModule.forRepositories(REPOSITORIES),
    
    // 业务模块
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
```

然后在各个服务中，只需要使用`@InjectRepository`装饰器即可：

```typescript
@Injectable()
export class UserService {
  @InjectRepository(UserEntity, UserRepository, 'test')
  private readonly userRepository: UserRepository;
  
  // ...
}

@Injectable()
export class PostService {
  @InjectRepository(PostEntity, PostRepository, 'test')
  private readonly postRepository: PostRepository;
  
  // ...
}
```

这种方式使代码更加简洁，更符合依赖注入的设计模式，避免了手动创建仓库实例的样板代码。
