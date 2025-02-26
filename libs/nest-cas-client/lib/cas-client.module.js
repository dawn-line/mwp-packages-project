"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CasClientModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasClientModule = void 0;
const common_1 = require("@nestjs/common");
const cas_client_constants_1 = require("./cas-client.constants");
const cas_client_service_1 = require("./cas-client.service");
let CasClientModule = CasClientModule_1 = class CasClientModule {
    static forRoot(options, isGlobal = true) {
        return {
            global: isGlobal,
            module: CasClientModule_1,
            providers: [
                cas_client_service_1.CasClientService,
                {
                    provide: cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [cas_client_service_1.CasClientService, cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS],
        };
    }
    static forRootAsync(options, isGlobal = false) {
        return {
            global: isGlobal,
            module: CasClientModule_1,
            imports: options.imports,
            providers: [
                cas_client_service_1.CasClientService,
                {
                    provide: cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
            ],
            exports: [cas_client_service_1.CasClientService, cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS],
        };
    }
};
exports.CasClientModule = CasClientModule;
exports.CasClientModule = CasClientModule = CasClientModule_1 = __decorate([
    (0, common_1.Module)({})
], CasClientModule);
//# sourceMappingURL=cas-client.module.js.map