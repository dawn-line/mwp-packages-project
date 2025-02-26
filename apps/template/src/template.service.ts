import { Injectable } from '@nestjs/common';
@Injectable()
export class TemplateService {
  getHello(): any {
    return 'Hello World!';
  }
}
