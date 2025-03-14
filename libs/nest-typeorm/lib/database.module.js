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
const typeorm_1 = require("typeorm");
const nest_common_1 = require("@cs/nest-common");
const database_constants_1 = require("./database.constants");
const dataSource_manager_1 = require("./dataSource.manager");
const entity_registry_1 = require("./entity.registry");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const connectionProvider = this.createConnectionProvider(options);
        return {
            module: DatabaseModule_1,
            providers: [
                {
                    provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                    useValue: options,
                },
                connectionProvider,
                {
                    provide: database_constants_1.DATA_SOURCE_MANAGER,
                    useFactory: (connections) => {
                        return new dataSource_manager_1.DataSourceManagerImpl(connections);
                    },
                    inject: [database_constants_1.DATABASE_CONNECTIONS],
                },
            ],
            exports: [
                database_constants_1.DATABASE_MODULE_OPTIONS,
                database_constants_1.DATABASE_CONNECTIONS,
                database_constants_1.DATA_SOURCE_MANAGER,
            ],
            global: true,
        };
    }
    static forRootAsync(options) {
        return {
            module: DatabaseModule_1,
            imports: options.imports || [],
            providers: [
                {
                    provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                {
                    provide: database_constants_1.DATABASE_CONNECTIONS,
                    useFactory: async (dbOptions) => {
                        const configWithEntities = {};
                        for (const key in dbOptions) {
                            configWithEntities[key] = {
                                ...dbOptions[key],
                                entities: (0, entity_registry_1.getRegisteredEntities)(key),
                                name: key,
                            };
                        }
                        return await this.createConnections(configWithEntities);
                    },
                    inject: [database_constants_1.DATABASE_MODULE_OPTIONS],
                },
                {
                    provide: database_constants_1.DATA_SOURCE_MANAGER,
                    useFactory: (connections) => {
                        return new dataSource_manager_1.DataSourceManagerImpl(connections);
                    },
                    inject: [database_constants_1.DATABASE_CONNECTIONS],
                },
            ],
            exports: [
                database_constants_1.DATABASE_MODULE_OPTIONS,
                database_constants_1.DATABASE_CONNECTIONS,
                database_constants_1.DATA_SOURCE_MANAGER,
            ],
            global: true,
        };
    }
    static createConnectionProvider(options) {
        return {
            provide: database_constants_1.DATABASE_CONNECTIONS,
            useFactory: async () => {
                const configWithEntities = {};
                for (const key in options) {
                    configWithEntities[key] = {
                        ...options[key],
                        entities: (0, entity_registry_1.getRegisteredEntities)(key),
                        name: key,
                    };
                }
                return await this.createConnections(configWithEntities);
            },
        };
    }
    static async createConnections(options) {
        const connections = new Map();
        const logger = new nest_common_1.LoggerService();
        for (const key in options) {
            const connectionOptions = options[key];
            const name = connectionOptions.name || key;
            if (connections.has(name)) {
                throw new Error(`数据库初始化错误: 连接名称 "${name}" 必须唯一`);
            }
            const dataSource = new typeorm_1.DataSource(connectionOptions);
            try {
                await dataSource.initialize();
                logger.log(`数据库连接 "${name}" 初始化成功!`, 'DatabaseModule');
                connections.set(name, dataSource);
            }
            catch (error) {
                logger.error(`数据库连接 "${name}" 初始化失败${error}`, 'DatabaseModule');
                throw error;
            }
        }
        return connections;
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], DatabaseModule);
//# sourceMappingURL=database.module.js.map