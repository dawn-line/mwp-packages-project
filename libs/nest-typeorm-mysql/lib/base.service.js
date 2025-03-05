"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        return this.repository.find(options);
    }
    async findWithPagination(page = 1, limit = 10, options) {
        const [items, total] = await this.repository.findAndCount({
            ...options,
            skip: (page - 1) * limit,
            take: limit,
        });
        return [items, total];
    }
    async findById(id, options) {
        return this.repository.findOne({
            ...options,
            where: { id },
        });
    }
    async findOne(options) {
        return this.repository.findOne(options);
    }
    async findByIds(ids, options) {
        return this.repository.find({
            ...options,
            where: {
                id: { $in: ids },
            },
        });
    }
    async create(data) {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async createMany(data) {
        const entities = this.repository.create(data);
        return this.repository.save(entities);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async updateMany(criteria, data) {
        const result = await this.repository.update(criteria, data);
        return result.affected > 0;
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected > 0;
    }
    async deleteMany(criteria) {
        const result = await this.repository.delete(criteria);
        return result.affected > 0;
    }
    async count(options) {
        return this.repository.count(options);
    }
    async exists(options) {
        const count = await this.count(options);
        return count > 0;
    }
    async query(sql, parameters) {
        return this.repository.query(sql, parameters);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map