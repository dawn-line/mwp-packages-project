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
exports.QueryConditionInput = void 0;
const class_validator_1 = require("class-validator");
class QueryConditionInput {
}
exports.QueryConditionInput = QueryConditionInput;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], QueryConditionInput.prototype, "select", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryConditionInput.prototype, "conditionLambda", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], QueryConditionInput.prototype, "conditionValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryConditionInput.prototype, "tableName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryConditionInput.prototype, "groupBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryConditionInput.prototype, "havingLambda", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], QueryConditionInput.prototype, "havingValue", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryConditionInput.prototype, "skip", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryConditionInput.prototype, "take", void 0);
//# sourceMappingURL=queryConditionInput.dto.js.map