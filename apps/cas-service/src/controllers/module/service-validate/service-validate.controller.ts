import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServiceValidateService } from './service-validate.service';

@Controller('serviceValidate')
@ApiTags('票据校验')
export class ServiceValidateController {
  constructor(
    private readonly serviceValidateService: ServiceValidateService,
  ) {}

  /**
   * 通过 POST 方法验证 ST 的有效性
   * POST /casServer/serviceValidate
   */
  // @Post()
  // @ApiOperation({ summary: '通过 POST 验证 ST 的有效性' })
  // @HttpCode(HttpStatus.OK)
  // validateServiceTicketPost(@Body() body: {
  //   ticket: string;
  //   service: string;
  //   renew?: boolean;
  // }) {
  //   const { ticket, service, renew } = body;
  //   return this.serviceValidateService.validateServiceTicket(ticket, service);
  // }

  /**
   * 通过 GET 方法验证 ST 的有效性
   * GET /casServer/serviceValidate?ticket=ST-xxx&service=yyy
   */
  @Get()
  @ApiOperation({ summary: '通过 GET 验证 ST 的有效性' })
  @HttpCode(HttpStatus.OK)
  async validateServiceTicketGet(
    @Query('ticket') ticket: string,
    @Query('service') service: string,
    @Query('renew') renew?: boolean,
    // @Query('pgtUrl') pgtUrl?: string,
    @Query('format') format: 'JSON' | 'XML' = 'JSON',
  ) {
    const result = await this.serviceValidateService.validateServiceTicket(
      ticket,
      service,
      renew,
      format,
    );
    return result;
  }
}
