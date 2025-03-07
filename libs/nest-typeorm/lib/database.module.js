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
const typeorm_1 = require("@nestjs/typeorm");
const entity_registry_1 = require("./entity.registry");
const database_service_1 = require("./database.service");
const database_constants_1 = require("./database.constants");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const connections = [];
        for (const key in options) {
            const element = options[key];
            const registeredEntities = (0, entity_registry_1.getRegisteredEntities)(element.name);
            connections.push(typeorm_1.TypeOrmModule.forRoot({
                ...element,
                name: element.name,
                entities: [...registeredEntities],
            }));
        }
        return {
            module: DatabaseModule_1,
            imports: [...connections],
            global: true,
        };
    }
    static forRootAsync(options) {
        return {
            module: DatabaseModule_1,
            imports: [
                ...(options.imports || []),
                typeorm_1.TypeOrmModule.forRootAsync({
                    inject: options.inject,
                    useFactory: async (...args) => {
                        const dbOptions = await options.useFactory(...args);
                        const registeredEntities = (0, entity_registry_1.getRegisteredEntities)();
                        return {
                            ...dbOptions,
                            entities: [...registeredEntities],
                        };
                    },
                }),
            ],
            providers: [
                {
                    provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
                database_service_1.DBService,
            ],
            exports: [database_service_1.DBService],
            global: true,
        };
    }
    static forFeature(registration) {
        return {
            module: DatabaseModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature(registration.entities, registration.connectionName),
            ],
            exports: [
                typeorm_1.TypeOrmModule.forFeature(registration.entities, registration.connectionName),
            ],
        };
    }
    static forFeatures(registrations) {
        const imports = [];
        const exports = [];
        registrations.forEach((registration) => {
            const typeOrmFeatureModule = typeorm_1.TypeOrmModule.forFeature(registration.entities, registration.connectionName);
            imports.push(typeOrmFeatureModule);
            exports.push(typeOrmFeatureModule);
        });
        return {
            module: DatabaseModule_1,
            imports,
            exports,
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], DatabaseModule);
//# sourceMappingURL=database.module.js.map