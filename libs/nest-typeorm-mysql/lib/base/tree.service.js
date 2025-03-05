"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTreeService = void 0;
class BaseTreeService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(entity) {
        return await this.repository.createTreeNode(entity);
    }
    async update(id, entity) {
        return await this.repository.updateTreeNode(id, entity);
    }
    async delete(id) {
        return await this.repository.deleteTreeNode(id);
    }
    async getTree() {
        return await this.repository.getTree();
    }
    async getAncestors(id) {
        return await this.repository.getTreeWithAncestors(id);
    }
    async getDescendants(id) {
        return await this.repository.getTreeWithDescendants(id);
    }
    async getParent(id) {
        return await this.repository.getParent(id);
    }
    async getChildren(id) {
        return await this.repository.getChildren(id);
    }
}
exports.BaseTreeService = BaseTreeService;
//# sourceMappingURL=tree.service.js.map