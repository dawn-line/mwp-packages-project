"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const typeorm_1 = require("typeorm");
class BaseRepository extends typeorm_1.Repository {
    async createEntity(entity) {
        const newEntity = this.create(entity);
        return await this.save(newEntity);
    }
    async createEntities(entities) {
        const newEntities = this.create(entities);
        return await this.save(newEntities);
    }
    async updateEntity(id, partialEntity) {
        const result = await this.update(id, partialEntity);
        return result.affected > 0;
    }
    async updateEntities(criteria, partialEntity) {
        const result = await this.update(criteria, partialEntity);
        return result.affected > 0;
    }
    async softDeleteEntity(id) {
        const result = await this.softDelete(id);
        return result.affected > 0;
    }
    async softDeleteEntities(criteria) {
        const result = await this.softDelete(criteria);
        return result.affected > 0;
    }
    async deleteEntity(id) {
        const result = await this.delete(id);
        return result.affected > 0;
    }
    async deleteEntities(criteria) {
        const result = await this.delete(criteria);
        return result.affected > 0;
    }
    async restoreEntity(id) {
        const result = await this.restore(id);
        return result.affected > 0;
    }
    async restoreEntities(criteria) {
        const result = await this.restore(criteria);
        return result.affected > 0;
    }
    async findOneEntity(options) {
        return await this.findOne(options);
    }
    async findById(id) {
        return await this.findOne({ where: { id } });
    }
    async findEntities(options) {
        return await this.find(options);
    }
    async paginate(options, page = 1, limit = 10) {
        const [items, total] = await this.findAndCount({
            ...options,
            skip: (page - 1) * limit,
            take: limit,
        });
        return [items, total];
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map