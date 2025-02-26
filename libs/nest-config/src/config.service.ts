import { Inject, Injectable, Optional } from '@nestjs/common';
import { CONFIG_OPTIONS } from './config/constants';
import { ConfigSchema } from './config/config.schema.interface';
@Injectable()
export class ConfigService {
  private config: ConfigSchema;
  constructor(@Optional() @Inject(CONFIG_OPTIONS) options: ConfigSchema) {
    this.config = options;
  }
  get(key: string): any {
    const option = this.config[key];
    return option;
  }

  isConfig(key: string): boolean {
    return !!this.config[key];
  }

  getAll(): ConfigSchema {
    return this.config;
  }
}
