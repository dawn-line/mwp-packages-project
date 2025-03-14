"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPOSITORY_FACTORY_TOKEN_PREFIX = void 0;
exports.getRepositoryToken = getRepositoryToken;
exports.createRepositoryProvider = createRepositoryProvider;
exports.InjectRepository = InjectRepository;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../base.repository");
const database_constants_1 = require("../database.constants");
const dataSource_manager_1 = require("../dataSource.manager");
exports.REPOSITORY_FACTORY_TOKEN_PREFIX = 'REPOSITORY_FACTORY_';
function getRepositoryToken(entity, repositoryClass) {
    const entityName = entity.name || (entity.constructor ? entity.constructor.name : 'Unknown');
    return `${exports.REPOSITORY_FACTORY_TOKEN_PREFIX}${entityName}_${repositoryClass.name}`;
}
function createRepositoryProvider(options) {
    const entity = options.entity;
    const repositoryClass = options.repository;
    const connectionName = options.connectionName || database_constants_1.DEFAULT_CONNECTION_NAME;
    const repoClass = repositoryClass || base_repository_1.CustomRepository;
    const token = getRepositoryToken(entity, repoClass);
    return {
        provide: token,
        useFactory: (dataSourceManager) => {
            return dataSourceManager.getCustomRepository(entity, repoClass, connectionName);
        },
        inject: [dataSource_manager_1.DataSourceManagerImpl],
    };
}
function InjectRepository(options) {
    const entity = options.entity;
    let repositoryClass;
    let connectionName = database_constants_1.DEFAULT_CONNECTION_NAME;
    connectionName = options.connectionName || database_constants_1.DEFAULT_CONNECTION_NAME;
    const repoClass = repositoryClass || base_repository_1.CustomRepository;
    const token = getRepositoryToken(entity, repoClass);
    return (target, propertyKey) => {
        (0, common_1.Inject)(token)(target, propertyKey);
        Reflect.defineMetadata('repository_info', { entity, repositoryClass: repoClass, connectionName }, target.constructor, propertyKey);
    };
}
//# sourceMappingURL=inject-repository.decorator.js.map