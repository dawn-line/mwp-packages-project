"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeService = void 0;
const base_service_1 = require("./base.service");
class TreeService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository);
        this.treeRepository = repository;
    }
    async findRoots() {
        return this.treeRepository.findRoots();
    }
    async findDescendants(entity) {
        return this.treeRepository.findDescendants(entity);
    }
    async findDescendantsTree(entity) {
        return this.treeRepository.findDescendantsTree(entity);
    }
    async findAncestors(entity) {
        return this.treeRepository.findAncestors(entity);
    }
    async findAncestorsTree(entity) {
        return this.treeRepository.findAncestorsTree(entity);
    }
    async createTree(data, parent) {
        const entity = this.treeRepository.create(data);
        if (parent) {
            entity.parent = parent;
        }
        return this.treeRepository.save(entity);
    }
    async getTree() {
        return this.treeRepository.findTrees();
    }
    async countDescendants(entity) {
        return this.treeRepository.countDescendants(entity);
    }
    async countAncestors(entity) {
        return this.treeRepository.countAncestors(entity);
    }
}
exports.TreeService = TreeService;
//# sourceMappingURL=tree.service.js.map