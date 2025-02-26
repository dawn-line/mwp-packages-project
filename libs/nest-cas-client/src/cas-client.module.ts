import { DynamicModule, Module } from '@nestjs/common';
import { CAS_CLIENT_MODULE_OPTIONS } from './cas-client.constants';
import { CasAsyncOptions, CasOptions } from './cas-options.interface';
import { CasClientService } from './cas-client.service';

@Module({})
export class CasClientModule {
  static forRoot(options: CasOptions, isGlobal = true): DynamicModule {
    return {
      global: isGlobal,
      module: CasClientModule,
      providers: [
        CasClientService,
        {
          provide: CAS_CLIENT_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [CasClientService, CAS_CLIENT_MODULE_OPTIONS],
    };
  }

  static forRootAsync(
    options: CasAsyncOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      global: isGlobal,
      module: CasClientModule,
      imports: options.imports,
      providers: [
        CasClientService,
        {
          provide: CAS_CLIENT_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [CasClientService, CAS_CLIENT_MODULE_OPTIONS],
    };
  }
}
