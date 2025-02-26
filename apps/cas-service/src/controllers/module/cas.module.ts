import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';
import { ServiceValidateController } from './service-validate/service-validate.controller';
import { ServiceValidateService } from './service-validate/service-validate.service';
@Module({
  controllers: [AuthController, TicketController, ServiceValidateController],
  providers: [AuthService, TicketService, ServiceValidateService],
})
export class CasServerModule {}
