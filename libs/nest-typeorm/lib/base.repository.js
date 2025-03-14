"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepository = exports.BaseRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const nest_common_1 = require("@cs/nest-common");
class BaseRepository extends typeorm_1.Repository {
    async findOne(dto) {
        const options = {
            where: dto,
        };
        return super.findOne(options);
    }
    async findMany(dto, take, skip) {
        return super.find({
            where: dto,
            take,
            skip,
        });
    }
    async findManyBase(queryConditionInput) {
        const queryBuilder = this.createQueryBuilder(queryConditionInput.tableName);
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
            return result;
        }
    }
    async saveOne(entity) {
        const entityDto = this.create(entity);
        const result = await this.save(entityDto, {
            transaction: false,
        });
        return result ? 1 : 0;
    }
    async saveMany(entities) {
        const entityDtos = entities.map((entity) => this.create(entity));
        const result = await this.save(entityDtos);
        return result.length;
    }
    async updateByCondition(updateData, conditions) {
        const result = await this.update(conditions, updateData);
        return result.affected || 0;
    }
    async softDeletion(conditions) {
        const result = await this.update(conditions, { isRemoved: true });
        return result.affected || 0;
    }
    async hardDelete(conditions) {
        const result = await this.delete(conditions);
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
            const records = await this.query(processedSql, paramValues);
            if (Array.isArray(records)) {
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
}
exports.BaseRepository = BaseRepository;
let CustomRepository = class CustomRepository extends BaseRepository {
};
exports.CustomRepository = CustomRepository;
exports.CustomRepository = CustomRepository = __decorate([
    (0, common_1.Injectable)()
], CustomRepository);
//# sourceMappingURL=base.repository.js.map