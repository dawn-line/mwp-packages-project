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
exports.BaseEntity = void 0;
const typeorm_1 = require("typeorm");
class BaseEntity {
    updateVersionTimestamp() {
        this.version = Date.now();
    }
}
exports.BaseEntity = BaseEntity;
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        comment: '创建时间',
        type: 'datetime',
        nullable: true,
    }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'creator_id',
        comment: '创建用户主键',
        type: 'bigint',
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntity.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'creator_name',
        comment: '添加人',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntity.prototype, "creatorName", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'modifier_at',
        comment: '上次修改时间',
        type: 'datetime',
        nullable: true,
    }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "modifierAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'modifier_id',
        comment: '修改用户主键',
        type: 'bigint',
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntity.prototype, "modifierId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'modifier_name',
        comment: '修改人',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], BaseEntity.prototype, "modifierName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_removed',
        comment: '删除标识',
        type: 'tinyint',
        default: false,
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isRemoved", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'version',
        comment: '版本号',
        type: 'bigint',
        nullable: true,
    }),
    __metadata("design:type", Number)
], BaseEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseEntity.prototype, "updateVersionTimestamp", null);
//# sourceMappingURL=base.entity.js.map