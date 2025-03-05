// express属性扩展

// 请求上下文接口定义

export interface User {
  // 根据您的实际用户数据结构定义属性
  userId?: string;
  [key: string]: any;
}
