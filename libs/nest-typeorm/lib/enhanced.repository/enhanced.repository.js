"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedRepositoryFactory = exports.EnhancedRepository = void 0;
const typeorm_1 = require("typeorm");
const nest_common_1 = require("@cs/nest-common");
class EnhancedRepository {
    static create(dataSource, entity) {
        const repository = dataSource.getRepository(entity);
        const enhancedRepo = new EnhancedRepository();
        enhancedRepo.repository = repository;
        this.proxyRepositoryMethods(enhancedRepo);
        return enhancedRepo;
    }
    static proxyRepositoryMethods(enhancedRepo) {
        const protoKeys = Object.getOwnPropertyNames(typeorm_1.Repository.prototype);
        for (const key of protoKeys) {
            if (key !== 'constructor' && typeof typeorm_1.Repository.prototype[key] === 'function' && !enhancedRepo[key]) {
                enhancedRepo[key] = function (...args) {
                    return enhancedRepo.repository[key](...args);
                };
            }
        }
        this.defineCommonMethods(enhancedRepo);
    }
    static defineCommonMethods(enhancedRepo) {
        if (!enhancedRepo.find) {
            enhancedRepo.find = function (options) {
                return enhancedRepo.repository.find(options);
            };
        }
        if (!enhancedRepo.findOne) {
            enhancedRepo.findOne = function (options) {
                return enhancedRepo.repository.findOne(options);
            };
        }
        if (!enhancedRepo.save) {
            enhancedRepo.save = function (entities, options) {
                return enhancedRepo.repository.save(entities, options);
            };
        }
        if (!enhancedRepo.update) {
            enhancedRepo.update = function (criteria, partialEntity) {
                return enhancedRepo.repository.update(criteria, partialEntity);
            };
        }
        if (!enhancedRepo.delete) {
            enhancedRepo.delete = function (criteria) {
                return enhancedRepo.repository.delete(criteria);
            };
        }
        if (!enhancedRepo.count) {
            enhancedRepo.count = function (options) {
                return enhancedRepo.repository.count(options);
            };
        }
        if (!enhancedRepo.createQueryBuilder) {
            enhancedRepo.createQueryBuilder = function (alias) {
                return enhancedRepo.repository.createQueryBuilder(alias);
            };
        }
        if (!enhancedRepo.query) {
            enhancedRepo.query = function (query, parameters) {
                return enhancedRepo.repository.query(query, parameters);
            };
        }
        if (!enhancedRepo.create) {
            enhancedRepo.create = function (entityLike) {
                return enhancedRepo.repository.create(entityLike);
            };
        }
    }
    async findOneByDto(dto) {
        const options = {
            where: dto,
        };
        return this.findOne(options);
    }
    async findManyByDto(dto, take, skip) {
        return this.find({
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
    async saveMany(entities, batchSize = 100) {
        let totalSaved = 0;
        for (let i = 0; i < entities.length; i += batchSize) {
            const batch = entities.slice(i, i + batchSize);
            const entityDtos = batch.map((entity) => this.create(entity));
            const result = await this.save(entityDtos);
            totalSaved += result.length;
        }
        return totalSaved;
    }
    async updateByCondition(updateData, conditions) {
        updateData.version = Date.now();
        const result = await this.update(conditions, updateData);
        return result.affected || 0;
    }
    async softDelete(conditions) {
        const result = await this.update(conditions, { isRemoved: true, version: Date.now() });
        return result;
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
    getRepository() {
        return this.repository;
    }
}
exports.EnhancedRepository = EnhancedRepository;
class EnhancedRepositoryFactory {
    static create(dataSource, entity, customRepositoryClass) {
        const baseRepo = EnhancedRepository.create(dataSource, entity);
        const customRepo = new customRepositoryClass();
        customRepo.repository = baseRepo.getRepository();
        Object.getOwnPropertyNames(baseRepo).forEach((key) => {
            if (key !== 'constructor' && key !== 'repository' && !customRepo[key]) {
                customRepo[key] = baseRepo[key];
            }
        });
        const protoKeys = Object.getOwnPropertyNames(EnhancedRepository.prototype);
        for (const key of protoKeys) {
            if (key !== 'constructor' &&
                typeof EnhancedRepository.prototype[key] === 'function' &&
                !customRepo[key]) {
                customRepo[key] = baseRepo[key].bind(baseRepo);
            }
        }
        return customRepo;
    }
}
exports.EnhancedRepositoryFactory = EnhancedRepositoryFactory;
//# sourceMappingURL=enhanced.repository.js.map