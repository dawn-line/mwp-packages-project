import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService, CommonUtil } from '@cs/nest-common';
import { RedisService } from '@cs/nest-redis';
import { ConfigService } from '@cs/nest-config';
import { RpcMethod, RpcService } from '@cs/nest-cloud';
import * as svgCaptcha from 'svg-captcha';
import { TicketService } from '../ticket/ticket.service';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto, CaptchaDto, LoginDto, UserDto } from './dto';
import { getUserList } from './users';

@Injectable()
@RpcService('auth')
export class AuthService {
  constructor(
    private readonly ticketService: TicketService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  @RpcMethod('login')
  async login(loginDto: LoginDto): Promise<string> {
    let user: UserDto;
    // const user = await this.validateUser(loginDto.userName, loginDto.password);
    // if (!user) {
    //   throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }
    // let user: User;
    switch (loginDto.flag) {
      case 'PASSWORD':
        user = await this.validatePassword(
          loginDto.userName,
          loginDto.password,
        );
        break;
      // case 'SMS':
      //   user = await this.validateSmsCode(
      //     loginDto.phoneNumber,
      //     loginDto.varifyCode,
      //   );
      //   break;
      default:
        throw new HttpException('Invalid login type', HttpStatus.UNAUTHORIZED);
    }
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // const payload = {
    //   username: user.userName,
    //   sub: user.userId,
    // };

    // 生成TGT
    const tgt = await this.ticketService.createTGT(user.userId);
    // console.log(tgt, loginDto);
    // // 如果提供了service，生成ST
    // if (loginDto.service) {
    //   let st = null;
    //   st = await this.ticketService.createST(tgt, loginDto.service);

    //   return {
    //     access_token: this.jwtService.sign(payload),
    //     tgt,
    //     service_ticket: st,
    //     redirect_url: st ? `${loginDto.service}?ticket=${st}` : null,
    //   };
    // }
    return tgt;
  }

  private async validatePassword(
    username: string,
    password: string,
  ): Promise<User> {
    // const user = await this.userRepository.findOne({ where: { username } });
    console.log(username, password);
    const user = getUserList().find((u) => u.userName === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  // private async validateSmsCode(phone: string, code: string): Promise<User> {
    // const isValid = await this.smsService.verifyCode(phone, code);
    // if (!isValid) {
    //   return null;
    // }

    // // 根据手机号查找用户
    // const user = await this.userRepository.findOne({ where: { phone } });
    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }
    // return user;
  // }

  @RpcMethod('logout')
  async logout(tgt: string): Promise<void> {
    this.ticketService.invalidateTGT(tgt);
  }

  /**
   * 生成验证码
   *
   * @param {ImageCaptchaDto} captcha
   * @return {*}  {Promise<CaptchaDto>}
   * @memberof AuthService
   */
  async getVerifyCode(captcha: ImageCaptchaDto): Promise<CaptchaDto> {
    const svg = svgCaptcha.createMathExpr({
      size: 4,
      ignoreChars: '0o1i',
      background: 'antiquewhite',
      color: true,
      noise: 2,
      fontSize: 58,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890qwertyuiopasdfghjklzxcvbnm',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: CommonUtil.idGenerate(),
    };
    await this.redisService
      .getRedis()
      .set(`auth:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    return result;
  }
}
