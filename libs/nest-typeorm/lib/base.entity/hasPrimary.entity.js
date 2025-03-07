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
exports.HasPrimaryFullTreeEntity = exports.HasPrimaryFullEntity = exports.HasPrimaryTreeEntity = exports.HasPrimaryEntity = exports.HasOnlyPrimaryEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tree_entity_1 = require("./tree.entity");
const hasEnable_entity_1 = require("./hasEnable.entity");
class HasOnlyPrimaryEntity {
}
exports.HasOnlyPrimaryEntity = HasOnlyPrimaryEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'id',
        comment: '主键',
        type: 'bigint',
    }),
    __metadata("design:type", String)
], HasOnlyPrimaryEntity.prototype, "id", void 0);
class HasPrimaryEntity extends base_entity_1.BaseEntity {
}
exports.HasPrimaryEntity = HasPrimaryEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'id',
        comment: '主键',
        type: 'bigint',
    }),
    __metadata("design:type", String)
], HasPrimaryEntity.prototype, "id", void 0);
class HasPrimaryTreeEntity extends tree_entity_1.TreeEntity {
}
exports.HasPrimaryTreeEntity = HasPrimaryTreeEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'id',
        comment: '主键',
        type: 'bigint',
    }),
    __metadata("design:type", String)
], HasPrimaryTreeEntity.prototype, "id", void 0);
class HasPrimaryFullEntity extends hasEnable_entity_1.HasEnableEntity {
}
exports.HasPrimaryFullEntity = HasPrimaryFullEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'id',
        comment: '主键',
        type: 'bigint',
    }),
    __metadata("design:type", String)
], HasPrimaryFullEntity.prototype, "id", void 0);
class HasPrimaryFullTreeEntity extends hasEnable_entity_1.HasEnableTreeEntity {
}
exports.HasPrimaryFullTreeEntity = HasPrimaryFullTreeEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'id',
        comment: '主键',
        type: 'bigint',
    }),
    __metadata("design:type", String)
], HasPrimaryFullTreeEntity.prototype, "id", void 0);
//# sourceMappingURL=hasPrimary.entity.js.map