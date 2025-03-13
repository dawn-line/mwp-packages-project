"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepository = CustomRepository;
exports.getRepositoryToken = getRepositoryToken;
exports.getEntityRepositoryMap = getEntityRepositoryMap;
const entityRepositoryMap = new Map();
function CustomRepository(entity) {
    return (target) => {
        entityRepositoryMap.set(entity, target);
    };
}
function getRepositoryToken(entity) {
    return entityRepositoryMap.get(entity);
}
function getEntityRepositoryMap() {
    return entityRepositoryMap;
}
//# sourceMappingURL=custom-repository.decorator.js.map