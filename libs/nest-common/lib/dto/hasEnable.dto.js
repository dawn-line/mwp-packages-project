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
exports.HasEnableTreeDto = exports.HasEnableDto = void 0;
const base_dto_1 = require("./base.dto");
const tree_dto_1 = require("./tree.dto");
const class_validator_1 = require("class-validator");
class HasEnableDto extends base_dto_1.BaseDto {
}
exports.HasEnableDto = HasEnableDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], HasEnableDto.prototype, "sortCode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HasEnableDto.prototype, "isEnable", void 0);
class HasEnableTreeDto extends tree_dto_1.TreeDto {
}
exports.HasEnableTreeDto = HasEnableTreeDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], HasEnableTreeDto.prototype, "sortCode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HasEnableTreeDto.prototype, "isEnable", void 0);
//# sourceMappingURL=hasEnable.dto.js.map