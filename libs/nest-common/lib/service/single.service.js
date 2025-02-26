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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
let SingleService = class SingleService {
    constructor(singleRepository) {
        this.singleRepository = singleRepository;
        this.defaultCtxParams = {
            user: {
                userId: '0000000000000000000000',
                realName: '系统用户',
            },
        };
    }
    async getOneBase(entitiesDto) {
        try {
            return await this.singleRepository.findOne({
                where: entitiesDto,
            });
        }
        catch (error) {
            throw new common_1.HttpException('请求异常', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findManyBase(entitiesDto) {
        try {
            return await this.singleRepository.find({
                where: entitiesDto,
            });
        }
        catch (error) {
            throw new common_1.HttpException('请求异常', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getManyBase(queryConditionInput) {
        if (queryConditionInput.skip !== undefined) {
            const result = await this.singleRepository
                .createQueryBuilder(queryConditionInput.tableName)
                .select(queryConditionInput.select)
                .where(queryConditionInput.conditionLambda, queryConditionInput.conditionValue)
                .orderBy(queryConditionInput.orderBy)
                .skip(queryConditionInput.skip)
                .take(queryConditionInput.take)
                .getManyAndCount();
            const pageResult = {
                result: result[0],
                count: result[1],
            };
            return pageResult;
        }
        else {
            const result = await this.singleRepository
                .createQueryBuilder(queryConditionInput.tableName)
                .select(queryConditionInput.select)
                .where(queryConditionInput.conditionLambda, queryConditionInput.conditionValue)
                .orderBy(queryConditionInput.orderBy)
                .take(queryConditionInput.take)
                .getMany();
            return result;
        }
    }
    async createOneBase(entityDto, ctxParams = {}, options = { reload: false, transaction: false }) {
        ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
        if (typeof entityDto === 'object' && !Array.isArray(entityDto)) {
            if (!entityDto.id) {
                entityDto.id = utils_1.CommonUtil.idGenerate();
            }
            entityDto.creatorId = ctxParams.user.userId;
            entityDto.creatorName = ctxParams.user.realName;
            entityDto.modifierId = ctxParams.user.userId;
            entityDto.modifierName = ctxParams.user.realName;
            entityDto.version = utils_1.CommonUtil.getVerSion();
            return await this.singleRepository.save(entityDto, options);
        }
        else {
            throw new common_1.HttpException('参数类型错误！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateOneBase(entityDto, ctxParams = {}, options = { reload: false, transaction: false }) {
        ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
        if (typeof entityDto === 'object' && !Array.isArray(entityDto)) {
            entityDto.modifierId = ctxParams.user.userId;
            entityDto.modifierName = ctxParams.user.realName;
            entityDto.version = utils_1.CommonUtil.getVerSion();
            return await this.singleRepository.save(entityDto, options);
        }
        else {
            throw new common_1.HttpException('参数类型错误！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateByCondition(entityDto, findEntityDto, ctxParams = {}) {
        ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
        try {
            entityDto.modifierId = ctxParams.user.userId;
            entityDto.modifierName = ctxParams.user.realName;
            entityDto.version = utils_1.CommonUtil.getVerSion();
            return await this.singleRepository.update(findEntityDto, entityDto);
        }
        catch (error) {
            throw new common_1.HttpException('参数类型错误！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveManyBase(entitiesDto, ctxParams = {}, options = { reload: false, transaction: true }) {
        ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
        const type = typeof entitiesDto;
        if (type === 'object' && Array.isArray(entitiesDto)) {
            entitiesDto.map((item) => {
                if (!item.id) {
                    item.id = utils_1.CommonUtil.idGenerate();
                    item.creatorId = ctxParams.user.userId;
                    item.creatorName = ctxParams.user.realName;
                }
                item.modifierId = ctxParams.user.userId;
                item.modifierName = ctxParams.user.realName;
                item.version = utils_1.CommonUtil.getVerSion();
            });
            return await this.singleRepository.save(entitiesDto, options);
        }
        else {
            throw new common_1.HttpException('参数类型错误！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBase(entitiesDto, ctxParams = {}, options = { reload: false, transaction: false }) {
        ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
        try {
            if (entitiesDto.length > 0) {
                entitiesDto.map((item) => {
                    if (!item.id) {
                        throw new common_1.HttpException('缺少主键id', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    item.isRemoved = true;
                    item.modifierId = ctxParams.user.userId;
                    item.modifierName = ctxParams.user.realName;
                    item.version = utils_1.CommonUtil.getVerSion();
                });
            }
            else {
                if (!entitiesDto.id) {
                    throw new common_1.HttpException('缺少主键id', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                entitiesDto.isRemoved = true;
                entitiesDto.modifierId = ctxParams.user.userId;
                entitiesDto.modifierName = ctxParams.user.realName;
                entitiesDto.version = utils_1.CommonUtil.getVerSion();
            }
            return await this.singleRepository.save(entitiesDto, options);
        }
        catch (error) {
            throw new common_1.HttpException('参数类型错误', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async destoryBase(entitiesDto, options = { reload: false, transaction: false }) {
        try {
            return await this.singleRepository.remove(entitiesDto, options);
        }
        catch (error) {
            throw new common_1.HttpException('参数类型错误', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async execute(querysql, parameters) {
        const arrParams = [];
        if (!(0, lodash_1.isEmpty)(parameters)) {
            const r = /\:\w+/g;
            const replaceWords = querysql.match(r);
            if (replaceWords) {
                querysql = querysql.replace(r, '?');
                replaceWords.forEach((i) => {
                    const arrtName = i.split(':')[1];
                    arrParams.push(parameters[arrtName]);
                });
            }
        }
        const records = await this.singleRepository.query(querysql, arrParams);
        if (Array.isArray(records)) {
            utils_1.CommonUtil.transRecords(records);
        }
        return records;
    }
};
exports.SingleService = SingleService;
exports.SingleService = SingleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SingleService);
//# sourceMappingURL=single.service.js.map