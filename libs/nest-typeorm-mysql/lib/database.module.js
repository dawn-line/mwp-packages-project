"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entity_registry_1 = require("./entity.registry");
const database_constants_1 = require("./database.constants");
let DatabaseConnectionInitializer = class DatabaseConnectionInitializer {
    constructor(options) {
        this.options = options;
    }
    async onModuleInit() {
        if (!this.options?.connections || this.options.connections.length <= 1) {
            return;
        }
        for (let i = 1; i < this.options.connections.length; i++) {
            const connection = this.options.connections[i];
            const registeredEntities = (0, entity_registry_1.getRegisteredEntities)(connection.name);
            console.log(`创建额外的数据库连接: ${connection.name}, 实体数量: ${registeredEntities.length}`);
            try {
                await createConnection({
                    ...connection,
                    name: connection.name,
                    entities: [...registeredEntities],
                });
                console.log(`数据库连接 ${connection.name} 创建成功`);
            }
            catch (error) {
                console.error(`创建数据库连接 ${connection.name} 失败:`, error);
            }
        }
    }
};
DatabaseConnectionInitializer = __decorate([
    Injectable(),
    __param(0, Inject(database_constants_1.DATABASE_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], DatabaseConnectionInitializer);
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const connections = options.connections.map((connection) => {
            const registeredEntities = (0, entity_registry_1.getRegisteredEntities)(connection.name);
            return typeorm_1.TypeOrmModule.forRoot({
                ...connection,
                name: connection.name,
                entities: [...registeredEntities],
            });
        });
        return {
            module: DatabaseModule_1,
            imports: [...connections],
            global: true,
        };
    }
    static forRootAsync(options) {
        const databaseOptionsProvider = {
            provide: database_constants_1.DATABASE_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
        return {
            module: DatabaseModule_1,
            imports: [
                ...(options.imports || []),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: options.imports,
                    inject: [database_constants_1.DATABASE_MODULE_OPTIONS],
                    useFactory: async (dbOptions) => {
                        if (!dbOptions?.connections || dbOptions.connections.length === 0) {
                            throw new Error('未提供数据库连接配置');
                        }
                        const firstConnection = dbOptions.connections[0];
                        const entities = (0, entity_registry_1.getRegisteredEntities)(firstConnection.name);
                        return {
                            ...firstConnection,
                            entities: [...entities],
                        };
                    },
                }),
            ],
            providers: [
                asyncOptionsProvider,
                DatabaseConnectionInitializer,
            ],
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