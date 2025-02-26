"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const http_constants_1 = require("./http.constants");
const http_service_1 = require("./http.service");
let HttpModule = HttpModule_1 = class HttpModule {
    static forRegister(options, isGlobal = false) {
        return {
            global: isGlobal,
            module: HttpModule_1,
            providers: [
                http_service_1.HttpService,
                {
                    provide: http_constants_1.HTTP_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [http_service_1.HttpService, http_constants_1.HTTP_MODULE_OPTIONS],
        };
    }
    static forRegisterAsync(options, isGlobal = false) {
        return {
            global: isGlobal,
            module: HttpModule_1,
            imports: options.imports,
            providers: [
                http_service_1.HttpService,
                {
                    provide: http_constants_1.HTTP_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
            ],
            exports: [http_service_1.HttpService, http_constants_1.HTTP_MODULE_OPTIONS],
        };
    }
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = HttpModule_1 = __decorate([
    (0, common_1.Module)({})
], HttpModule);
//# sourceMappingURL=http.module.js.map