import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  HttpException,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserIdDto } from '../auth/dto';
import { TicketService } from './ticket.service';

@Controller('tickets')
@ApiTags('票据管理')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    // private readonly config: ConfigService,
  ) {}

  /**
   * 创建 Ticket-Granting Ticket (TGT)
   * POST /cas/v1/tickets
   */
  @Post()
  @ApiOperation({ summary: '创建新的 TGT' })
  @HttpCode(HttpStatus.CREATED)
  createTicket(@Body() body: UserIdDto) {
    const { userId } = body;
    return this.ticketService.createTGT(userId);
  }

  /**
   * 使用 TGT 创建 Service Ticket (ST)
   * POST /cas/v1/tickets/:tgt
   */
  @Post(':tgt')
  @ApiOperation({ summary: '使用 TGT 创建新的 ST' })
  @HttpCode(HttpStatus.CREATED)
  createServiceTicket(@Param('tgt') tgt: string, @Body() body: any) {
    const { service } = body;
    return this.ticketService.createST(tgt, service);
  }

  /**
   * 删除 Ticket-Granting Ticket (TGT) - 登出
   * DELETE /cas/v1/tickets/:tgt
   */
  @Delete(':tgt')
  @ApiOperation({ summary: '删除指定的 TGT，实现登出' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTicket(@Param('tgt') tgt: string) {
    return this.ticketService.invalidateTGT(tgt);
  }

  /**
   * 验证 Service Ticket (ST)
   * GET /cas/v1/tickets/validate?ticket=ST-xxx&service=yyy
   */
  @Get('validate')
  @ApiOperation({ summary: '验证 ST 的有效性' })
  validateTicket(
    @Query('ticket') ticket: string,
    @Query('service') service: string,
  ) {
    return this.ticketService.validateST(ticket, service);
  }

  /**
   * 自定义登出接口
   * POST /cas/v1/tickets/logout
   */
  // @Post('logout')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // logout(@Body() body: any) {
  //   return this.ticketService.logout(body);
  // }
}
