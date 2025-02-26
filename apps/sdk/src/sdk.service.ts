import { Injectable } from '@nestjs/common';

@Injectable()
export class SdkService {
  getHello(): string {
    return 'Hello World!';
  }
}
