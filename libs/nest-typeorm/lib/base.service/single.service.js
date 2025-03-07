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
exports.SingleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const nest_common_1 = require("@cs/nest-common");
let SingleService = class SingleService {
    constructor(repository) {
        this.repository = repository;
    }
    async findOne(dto) {
        const options = {
            where: dto,
        };
        return this.repository.findOne(options);
    }
    async findMany(dto, take, skip) {
        return this.repository.find({
            where: dto,
            take,
            skip,
        });
    }
    async findManyBase(queryConditionInput) {
        const queryBuilder = this.repository.createQueryBuilder(queryConditionInput.tableName);
        if (queryConditionInput.select) {
            queryBuilder.select(queryConditionInput.select);
        }
        if (queryConditionInput.conditionLambda) {
            queryBuilder.where(queryConditionInput.conditionLambda, queryConditionInput.conditionValue || {});
        }
        if (queryConditionInput.orderBy) {
            queryBuilder.orderBy(queryConditionInput.orderBy);
        }
        if (queryConditionInput.take !== undefined) {
            queryBuilder.take(queryConditionInput.take);
        }
        if (queryConditionInput.skip !== undefined) {
            queryBuilder.skip(queryConditionInput.skip);
            const [result, count] = await queryBuilder.getManyAndCount();
            return {
                result: result,
                count,
            };
        }
        else {
            const result = await queryBuilder.getMany();
            console.log(result);
            return result;
        }
    }
    async saveOne(entity) {
        const entityDto = this.repository.create(entity);
        const result = await this.repository.save(entityDto, {
            transaction: false,
        });
        return result ? 1 : 0;
    }
    async saveMany(entities) {
        const entityDtos = entities.map((entity) => this.repository.create(entity));
        const result = await this.repository.save(entityDtos);
        return result.length;
    }
    async updateByCondition(updateData, conditions) {
        updateData.version = Date.now();
        const result = await this.repository.update(conditions, updateData);
        return result.affected || 0;
    }
    async softDelete(conditions) {
        const result = await this.repository.update(conditions, { isRemoved: true, version: Date.now() });
        return result.affected || 0;
    }
    async hardDelete(conditions) {
        const result = await this.repository.delete(conditions);
        return result.affected || 0;
    }
    async executeSql(querySql, parameters) {
        try {
            let processedSql = querySql;
            const paramValues = [];
            if (parameters && Object.keys(parameters).length > 0) {
                const namedParamRegex = /\:(\w+)/g;
                const matches = [...querySql.matchAll(namedParamRegex)];
                if (matches.length > 0) {
                    const paramNames = matches.map((match) => match[1]);
                    processedSql = querySql.replace(namedParamRegex, '?');
                    paramNames.forEach((name) => {
                        if (name in parameters) {
                            paramValues.push(parameters[name]);
                        }
                        else {
                            throw new Error(`缺少SQL参数: ${name}`);
                        }
                    });
                }
            }
            const records = await this.repository.query(processedSql, paramValues);
            if (Array.isArray(records)) {
                console.log(records);
                nest_common_1.CommonUtil.transRecords(records);
            }
            return records;
        }
        catch (error) {
            console.error(`SQL执行错误: ${error.message}`, {
                sql: querySql,
                params: parameters,
            });
            throw error;
        }
    }
};
exports.SingleService = SingleService;
exports.SingleService = SingleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SingleService);
//# sourceMappingURL=single.service.js.map