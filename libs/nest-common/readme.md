## @cs/nest-common

### 服务方法

#### singleService 标准api说明

- getOneBase 根据实体查询符合条件的单个结果集

> 该方法根据传递的实体对象的属性拼接查询对象，主要用于真实字段匹配查询单个对象，如果要查询多种条件、分页、聚合等需求，应该使用`getManyBase`方法。

  参数：
  ```js
    entitiesDto: any,  // 查询条件的实体对象
  ```

  返回值：

  ```json
  {
      "code": 200,
      "status": "success",
      "message": "",
      "result": {
        ... // 实体对象
      }
  }
  ```

- getManyBase 根据条件获取单条或多条结果集包含分页。

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
- 返回值：
```js
{
    "code": 201,
    "status": "success",
    "message": "",
    "result": [
      ... // 多组实体对象
    ]
}
```
当实体中包含skip属性时按分页方式返回结构如下：

```js
{
    "code": 201,
    "status": "success",
    "message": "",
    "result": {
        "result": [
            {
                "id": "3kLxkUB_u65fDYC8mOR4w",
                "roleName": "string"
            },
            {
                "id": "B96Lhvy7vAZ_P5cgc5h9P",
                "roleName": "string"
            }
        ],
        "count": 11
    }
}
```

调用示例：

- 查询单表返回多条结果集传参示例

```json
{
    "select": [
        "roles.id",
        "roles.roleName"
    ],
    "tableName": "roles",
    "conditionLambda": "roles.roleName = :roleName" ,
    "conditionValue": {
        "roleName":"string"
    },
    "take":10
}
````

- 查询单表返回多条分页结构的结果集传参示例

```json
{
    "select": [
        "roles.id",
        "roles.roleName"
    ],
    "tableName": "roles",
    "conditionLambda": "roles.roleName = :roleName" ,
    "conditionValue": {
        "roleName":"string"
    },
    "skip": 0,
    "take":2
}
````
- createOneBase 添加单条实体

> 该方法根据对单挑实体对象进行添加操作，要求传递的对象必须会包含主键数据（id主键会自动生成，其它主键需要提前生成），会根据主键信息进行实体上的属性进行写入，要注意 如果传递的主键信息存在会进行更新操作。

  参数：
  ```js
    entitiesDto: any,  // 添加实体对象
    ctxParams: any = {}, // 系统上下文，系统会默认传入，可以改变
    options: SaveOptions = { 
                  reload: false,   // 更新或插入完成后是否返回插入实体信息
                  transaction: false, // 开启事务
                  }, 
  ```

  返回值：

  ```json
{
    "code": 201,
    "status": "success",
    "message": "",
    "result": {
      ... // 实体对象
    }
}
  ```


- updateOneBase 更新单条实体

> 该方法根据对单挑实体对象进行更新操作，要求传递的对象必须会包含主键数据，会根据主键信息进行实体上的属性完全更新（所以不需要更新的属性不要带在实体上），要注意 如果传递的主键信息不存在会进行插入操作。

  参数：
  ```js
    entitiesDto: any,  // 编辑实体对象
    ctxParams: any = {}, // 系统上下文，系统会默认传入，可以改变
    options: SaveOptions = { 
                  reload: false,   // 更新或插入完成后是否返回插入实体信息
                  transaction: false, // 开启事务
                  }, 
  ```

  返回值：

  ```json
{
    "code": 200,
    "status": "success",
    "message": "",
    "result": {
      ... // 实体对象
    }
}
  ```


- updateByCondition 按条件更新对象

> 该方法根据根据传递的对象条件以及更新对象对数据进行更新操作（使用时要注意传入的条件对象要合理，否则会大量更新对应数据对象）。

  参数：
  ```js
    entityDto: any, // 要更新的实体对象
    findEntityDto: any,  // 更新的条件对象
    ctxParams: any = {},
  ```

  返回值：

  ```json
{
    "code": 200,
    "status": "success",
    "message": "",
    "result": {
       "generatedMaps": [],
        "raw": [],
        "affected": 9
    }
}
  ```

- saveManyBase  新增或更新单条或者多条实体

> 该方法将多条实体对象进行新增或编辑操作。根据主键查询决定是否新增还是修改，默认会开启事务。

  参数：
  ```js
    entitiesDto: any[],  // 编辑实体数组对象
    ctxParams: any = {}, // 系统上下文，系统会默认传入，可以改变
    options: SaveOptions = { 
                  reload: false,   // 更新或插入完成后是否返回插入实体信息
                  transaction: true, // 开启事务(默认开启)
              }, 
  ```

  返回值：

  ```json
{
    "code": 201,
    "status": "success",
    "message": "",
    "result": [
        { ... },  // 操作的实体
        { ... },
    ]
}
  ```

- deleteBase 软删除单条或多条实体

> 该方法将软删除单条或者多条实体，根据传递的主键对象或数组对软删标识进行更新操作（实体对象或数组对象应该只包含主键信息，如何包含其它信息将会被更新）。

  参数：
  ```js
    entitiesDto: any,  // 软删的实体数组对象
    ctxParams: any = {}, // 系统上下文，系统会默认传入，可以改变
    options: SaveOptions = { 
                  reload: false,   // 更新或插入完成后是否返回插入实体信息
                  transaction: false, // 开启事务(默认关闭)
              }, 
  ```

  返回值：

  ```json
{
    "code": 200,
    "status": "success",
    "message": "",
    "result": {
       { ... }  // 实体对象
    }
 }
  ```
- destoryBase 真删单条或多条实体
  
> 该方法根据传递的对象或者数组真删单条或者多条数据。

  参数：

  ```js
    entitiesDto: any,  //删除的对象条件或对象数组
    options: SaveOptions = { 
              reload: false, 
              transaction: false 
            },
  ```

  返回值：

  ```json
{
    "code": 200,
    "status": "success",
    "message": "",
    "result": {
    }
}
  ```

- execute 执行rawsql

> 该方法允许执行原生得sql语句，比较灵活。

> 该方法根据传递的对象或者数组真删单条或者多条数据（注意：为了更好方式sql注入问题，不应该将外来参数拼接到sql语句中）。

  参数：

  ```js
  querysql: string,  //sql语句
  parameters?: object  //参数集合对象

  ```

  传参示例：
  ```js
   const sql = `select * from auth_role where role_name = :name and is_removed = :isRemoved`;
   const params = {
      name: 'string',
      isRemoved: false,
    };
    return await this.roleService.execute(sql, params);
  ```

  返回值：

  ```json
{
    "code": 200,
    "status": "success",
    "message": "",
    "result": {
    }
}
  ```




#### 数据库迁移 

#### 多库连接


## @cs/nest-common


### 日志模块

日志模块在nest-cloud中已经全局注册，可以直接注入使用，具体使用方式请参考[日志](./logger/readme.md)


### 基础模型实体定义

### 常用函数库

#
