import { Controller, Get, UseGuards } from '@nestjs/common';
import { CasClientGuard } from '@cs/nest-cas-client';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseGuards(CasClientGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
