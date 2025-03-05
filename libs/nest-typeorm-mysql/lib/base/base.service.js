"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(entity) {
        return await this.repository.createEntity(entity);
    }
    async createMany(entities) {
        return await this.repository.createEntities(entities);
    }
    async update(id, entity) {
        return await this.repository.updateEntity(id, entity);
    }
    async updateMany(criteria, entity) {
        return await this.repository.updateEntities(criteria, entity);
    }
    async softDelete(id) {
        return await this.repository.softDeleteEntity(id);
    }
    async softDeleteMany(criteria) {
        return await this.repository.softDeleteEntities(criteria);
    }
    async delete(id) {
        return await this.repository.deleteEntity(id);
    }
    async deleteMany(criteria) {
        return await this.repository.deleteEntities(criteria);
    }
    async restore(id) {
        return await this.repository.restoreEntity(id);
    }
    async restoreMany(criteria) {
        return await this.repository.restoreEntities(criteria);
    }
    async findOne(options) {
        return await this.repository.findOneEntity(options);
    }
    async findById(id) {
        return await this.repository.findById(id);
    }
    async findAll(options = {}) {
        return await this.repository.findEntities(options);
    }
    async paginate(options = {}, page = 1, limit = 10) {
        return await this.repository.paginate(options, page, limit);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map