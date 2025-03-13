"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
class RepositoryFactory {
    static create(dataSource, entity, customRepositoryClass) {
        const entityMetadata = dataSource.getMetadata(entity);
        const repository = new customRepositoryClass();
        const baseRepository = dataSource.getRepository(entity);
        Object.keys(baseRepository).forEach((key) => {
            if (key !== 'constructor' && key !== 'metadata') {
                repository[key] = baseRepository[key];
            }
        });
        const baseProto = Object.getPrototypeOf(baseRepository);
        const repoProto = Object.getPrototypeOf(repository);
        Object.getOwnPropertyNames(baseProto).forEach((method) => {
            if (method !== 'constructor' &&
                method !== 'metadata' &&
                typeof baseProto[method] === 'function' &&
                !(method in repoProto)) {
                repoProto[method] = baseProto[method];
            }
        });
        repository.queryRunner = dataSource.createQueryRunner();
        return repository;
    }
}
exports.RepositoryFactory = RepositoryFactory;
//# sourceMappingURL=repository.factory.js.map