import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MFAService {
  // 内存存储示例，生产环境应使用持久化存储
  private mfaRequests: Record<string, any> = {}; // mfaId -> MFA 请求信息

  /**
   * 请求进行多因素认证
   * @param body 请求体包含用户标识等信息
   */
  requestMFA(body: any) {
    const { userId, method } = body;
    // TODO: 根据 method（如 SMS、Email、Authenticator App）发送 MFA 验证码
    const mfaId = uuidv4();
    const code = '123456'; // 示例验证码，实际应随机生成并发送
    this.mfaRequests[mfaId] = { userId, method, code, createdAt: new Date() };
    // 在实际应用中，应通过短信、邮件或其他方式发送验证码
    console.log(`MFA Code for ${userId}: ${code}`);
    return { mfaId, message: 'MFA code sent' };
  }

  /**
   * 验证多因素认证结果
   * @param body 请求体包含 mfaId 和 code
   */
  verifyMFA(body: any) {
    const { mfaId, code } = body;
    const request = this.mfaRequests[mfaId];
    if (request && request.code === code) {
      delete this.mfaRequests[mfaId];
      return { success: true, message: 'MFA verified' };
    }
    throw new HttpException('Invalid MFA Code', HttpStatus.BAD_REQUEST);
  }
}
