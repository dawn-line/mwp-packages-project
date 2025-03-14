"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistModule = void 0;
exports.createRepositoryModule = createRepositoryModule;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database.constants");
const dataSource_manager_1 = require("../dataSource.manager");
const base_repository_1 = require("../base.repository");
const inject_repository_decorator_1 = require("./inject-repository.decorator");
function createRepositoryModule(repositories) {
    const providers = [
        {
            provide: dataSource_manager_1.DataSourceManagerImpl,
            useFactory: (connections) => {
                return new dataSource_manager_1.DataSourceManagerImpl(connections);
            },
            inject: [database_constants_1.DATABASE_CONNECTIONS],
        },
        ...repositories.map((reg) => (0, inject_repository_decorator_1.createRepositoryProvider)({
            entity: reg.entity,
            repository: reg.repository,
            connectionName: reg.connectionName,
        })),
    ];
    const providerTokens = repositories.map((reg) => {
        const repoClass = reg.repository || base_repository_1.CustomRepository;
        return (0, inject_repository_decorator_1.getRepositoryToken)(reg.entity, repoClass);
    });
    return {
        module: RegistModule,
        providers,
        exports: [dataSource_manager_1.DataSourceManagerImpl, ...providerTokens],
    };
}
let RegistModule = class RegistModule {
    static forRepositories(repositories) {
        return createRepositoryModule(repositories);
    }
};
exports.RegistModule = RegistModule;
exports.RegistModule = RegistModule = __decorate([
    (0, common_1.Module)({})
], RegistModule);
//# sourceMappingURL=repository-module.decorator.js.map