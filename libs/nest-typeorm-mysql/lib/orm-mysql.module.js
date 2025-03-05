"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const orm_mysql_providers_1 = require("./orm-mysql.providers");
const orm_mysql_constants_1 = require("./orm-mysql.constants");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const providers = [
            {
                provide: orm_mysql_constants_1.DATABASE_MODULE_OPTIONS,
                useValue: options,
            },
            ...(0, orm_mysql_providers_1.createDatabaseProviders)(),
        ];
        return {
            module: DatabaseModule_1,
            providers,
            exports: providers,
        };
    }
    static forRootAsync(options) {
        const providers = [
            {
                provide: orm_mysql_constants_1.DATABASE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            },
            ...(0, orm_mysql_providers_1.createDatabaseProviders)(),
        ];
        return {
            module: DatabaseModule_1,
            providers,
            exports: providers,
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
//# sourceMappingURL=orm-mysql.module.js.map