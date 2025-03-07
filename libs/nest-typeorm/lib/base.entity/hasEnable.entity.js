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
exports.HasEnableTreeEntity = exports.HasEnableEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tree_entity_1 = require("./tree.entity");
class HasEnableEntity extends base_entity_1.BaseEntity {
}
exports.HasEnableEntity = HasEnableEntity;
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_code',
        comment: '排序',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], HasEnableEntity.prototype, "sortCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_enable',
        comment: '启用',
        type: 'tinyint',
        nullable: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], HasEnableEntity.prototype, "isEnable", void 0);
class HasEnableTreeEntity extends tree_entity_1.TreeEntity {
}
exports.HasEnableTreeEntity = HasEnableTreeEntity;
__decorate([
    (0, typeorm_1.Column)({
        name: 'sort_code',
        comment: '排序',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], HasEnableTreeEntity.prototype, "sortCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_enable',
        comment: '启用',
        type: 'tinyint',
        nullable: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], HasEnableTreeEntity.prototype, "isEnable", void 0);
//# sourceMappingURL=hasEnable.entity.js.map