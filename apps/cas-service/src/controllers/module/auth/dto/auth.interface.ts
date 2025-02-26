export interface ServiceRule {
  domain: string; // 域名
  pathPattern?: string; // 路径匹配模式，支持 * 通配符
  protocol?: string; // 协议，如 http 或 https
  exact?: boolean; // 是否精确匹配
}
