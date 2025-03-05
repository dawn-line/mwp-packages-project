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
exports.HasPrimaryFullTreeDto = exports.HasPrimaryFullDto = exports.HasPrimaryTreeDto = exports.HasPrimaryDto = void 0;
const base_dto_1 = require("./base.dto");
const tree_dto_1 = require("./tree.dto");
const hasEnable_dto_1 = require("./hasEnable.dto");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
class HasPrimaryDto extends base_dto_1.BaseDto {
}
exports.HasPrimaryDto = HasPrimaryDto;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HasPrimaryDto.prototype, "id", void 0);
class HasPrimaryTreeDto extends tree_dto_1.TreeDto {
}
exports.HasPrimaryTreeDto = HasPrimaryTreeDto;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HasPrimaryTreeDto.prototype, "id", void 0);
class HasPrimaryFullDto extends hasEnable_dto_1.HasEnableDto {
}
exports.HasPrimaryFullDto = HasPrimaryFullDto;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HasPrimaryFullDto.prototype, "id", void 0);
class HasPrimaryFullTreeDto extends hasEnable_dto_1.HasEnableTreeDto {
}
exports.HasPrimaryFullTreeDto = HasPrimaryFullTreeDto;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HasPrimaryFullTreeDto.prototype, "id", void 0);
//# sourceMappingURL=hasPrimary.dto.js.map