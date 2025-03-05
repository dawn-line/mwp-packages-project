"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTreeRepository = void 0;
const typeorm_1 = require("typeorm");
class BaseTreeRepository extends typeorm_1.TreeRepository {
    async createTreeNode(entity) {
        const newEntity = this.create(entity);
        return await this.save(newEntity);
    }
    async updateTreeNode(id, partialEntity) {
        const result = await this.update(id, partialEntity);
        return result.affected > 0;
    }
    async deleteTreeNode(id) {
        const descendants = await this.findDescendants(await this.findOne({ where: { id } }));
        const descendantIds = descendants.map((node) => node.id);
        if (descendantIds.length > 0) {
            const result = await this.delete(descendantIds);
            return result.affected > 0;
        }
        return false;
    }
    async getTree() {
        return await this.findTrees();
    }
    async getTreeWithAncestors(id) {
        const entity = await this.findOne({ where: { id } });
        if (!entity)
            return [];
        return await this.findAncestors(entity);
    }
    async getTreeWithDescendants(id) {
        const entity = await this.findOne({ where: { id } });
        if (!entity)
            return [];
        return await this.findDescendants(entity);
    }
    async getParent(id) {
        const entity = await this.findOne({
            where: { id },
            relations: ['parent'],
        });
        return entity?.parent || null;
    }
    async getChildren(id) {
        const entity = await this.findOne({ where: { id } });
        if (!entity)
            return [];
        return await this.findDescendants(entity, { depth: 1 });
    }
}
exports.BaseTreeRepository = BaseTreeRepository;
//# sourceMappingURL=tree.repository.js.map