"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
class TreeEntity extends base_entity_1.BaseEntity {
}
exports.TreeEntity = TreeEntity;
__decorate([
    (0, typeorm_1.Column)({
        name: 'parent_id',
        comment: '父节点主键',
        type: 'bigint',
        nullable: true,
    }),
    __metadata("design:type", String)
], TreeEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'full_id',
        comment: '主键全路径',
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", String)
], TreeEntity.prototype, "fullId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'full_name',
        comment: '名称全路径',
        type: 'varchar',
        length: 2000,
        nullable: true,
    }),
    __metadata("design:type", String)
], TreeEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'level',
        comment: '层级',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], TreeEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_leaf',
        comment: '子节点标识',
        type: 'tinyint',
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], TreeEntity.prototype, "isLeaf", void 0);
//# sourceMappingURL=tree.entity.js.map