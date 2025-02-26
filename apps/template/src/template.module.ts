import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { CustomMiddleware, CSModule } from '@cs/nest-cloud';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
@CSModule({
  imports: [],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [],
})
export class AppModule {}
