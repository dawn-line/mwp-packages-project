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
const base_entity_1 = require("./base.entity");
const typeorm_1 = require("typeorm");
let TreeEntity = class TreeEntity extends base_entity_1.BaseEntity {
};
exports.TreeEntity = TreeEntity;
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], TreeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TreeEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    (0, typeorm_1.ManyToOne)(() => base_entity_1.BaseEntity, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Object)
], TreeEntity.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    (0, typeorm_1.OneToMany)(() => base_entity_1.BaseEntity, (entity) => entity.parent),
    __metadata("design:type", Array)
], TreeEntity.prototype, "children", void 0);
exports.TreeEntity = TreeEntity = __decorate([
    (0, typeorm_1.Tree)('closure-table')
], TreeEntity);
//# sourceMappingURL=tree.entity.js.map