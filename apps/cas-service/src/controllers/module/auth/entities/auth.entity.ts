export interface User {
  id: number;
  username: string;
  password: string; // 应该是加密后的密码
  email: string;
  // 其他属性如角色、权限等
}
