### cas-server认证服务

#### 配置

cas相关配置都在cas配置节点下：


serviceRules

> 服务合法性校验规则

```yaml
cas:
  serviceRules:
    - domain: 'example.com'
      protocol: 'https'
      pathPattern: '/app/*'  // 匹配所有 /app/ 下的路径
    - domain: 'test.com'
      pathPattern: '/api/v1/*'
      exact: false
    - domain: 'localhost:3000'
      protocol: 'http'
    - domain: 'admin.example.com'
      pathPattern: '/dashboard'
      exact: true,  // 只允许精确匹配 /dashboard
```
使用示例：

```js
// 有效的 URL
validateServiceUrl('https://example.com/app/user')      // true
validateServiceUrl('https://example.com/app/admin')     // true
validateServiceUrl('http://localhost:3000/any/path')    // true
validateServiceUrl('https://admin.example.com/dashboard') // true

// 无效的 URL
validateServiceUrl('http://example.com/app/user')       // false (协议不匹配)
validateServiceUrl('https://example.com/other/path')    // false (路径不匹配)
validateServiceUrl('https://admin.example.com/other')   // false (精确路径不匹配)
validateServiceUrl('https://unknown.com/app/user')      // false (域名不在允许列表)
```
