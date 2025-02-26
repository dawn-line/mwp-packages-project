import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  // 内存存储示例，生产环境应使用持久化存储
  private tokens: Record<string, any> = {}; // token -> 令牌信息

  /**
   * 生成访问令牌
   * @param body 请求体包含用户信息和权限等
   */
  createToken(body: any) {
    const { userId, scope } = body;
    const token = uuidv4();
    this.tokens[token] = {
      userId,
      scope,
      createdAt: new Date(),
      revoked: false,
    };
    return { accessToken: token, tokenType: 'Bearer', scope };
  }

  /**
   * 撤销访问令牌
   * @param body 请求体包含要撤销的令牌
   */
  revokeToken(body: any) {
    const { token } = body;
    if (this.tokens[token]) {
      this.tokens[token].revoked = true;
      return { success: true, message: 'Token revoked' };
    }
    throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
  }

  /**
   * 检查令牌的有效性
   * @param token 访问令牌
   */
  introspectToken(token: string) {
    const tokenData = this.tokens[token];
    if (tokenData && !tokenData.revoked) {
      return { active: true, userId: tokenData.userId, scope: tokenData.scope };
    }
    return { active: false };
  }
}
