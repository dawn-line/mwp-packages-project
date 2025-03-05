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
exports.HasPrimaryGenertedFullTreeEntity = exports.HasPrimaryGenertedFullEntity = exports.HasPrimaryGenertedTreeEntity = exports.HasPrimaryGenertedEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tree_entity_1 = require("./tree.entity");
const hasAction_entity_1 = require("./hasAction.entity");
class HasPrimaryGenertedEntity extends base_entity_1.BaseEntity {
}
exports.HasPrimaryGenertedEntity = HasPrimaryGenertedEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'id',
        comment: '主键',
    }),
    __metadata("design:type", String)
], HasPrimaryGenertedEntity.prototype, "id", void 0);
class HasPrimaryGenertedTreeEntity extends tree_entity_1.TreeEntity {
}
exports.HasPrimaryGenertedTreeEntity = HasPrimaryGenertedTreeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'id',
        comment: '主键',
    }),
    __metadata("design:type", String)
], HasPrimaryGenertedTreeEntity.prototype, "id", void 0);
class HasPrimaryGenertedFullEntity extends hasAction_entity_1.HasActionEntity {
}
exports.HasPrimaryGenertedFullEntity = HasPrimaryGenertedFullEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'id',
        comment: '主键',
    }),
    __metadata("design:type", String)
], HasPrimaryGenertedFullEntity.prototype, "id", void 0);
class HasPrimaryGenertedFullTreeEntity extends hasAction_entity_1.HasActionTreeEntity {
}
exports.HasPrimaryGenertedFullTreeEntity = HasPrimaryGenertedFullTreeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'id',
        comment: '主键',
    }),
    __metadata("design:type", String)
], HasPrimaryGenertedFullTreeEntity.prototype, "id", void 0);
//# sourceMappingURL=hasPrimaryGenerted.entity.js.map