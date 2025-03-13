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
exports.DataSourceManagerImpl = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("./database.constants");
const repository_factory_1 = require("./repository.factory");
let DataSourceManagerImpl = class DataSourceManagerImpl {
    constructor(initialDataSources) {
        this.dataSources = new Map();
        if (initialDataSources) {
            this.dataSources = new Map(initialDataSources);
        }
    }
    getDataSource(name = database_constants_1.DEFAULT_CONNECTION_NAME) {
        if (!this.dataSources.has(name)) {
            throw new Error(`数据源 "${name}" 不存在`);
        }
        return this.dataSources.get(name);
    }
    getAllDataSources() {
        return this.dataSources;
    }
    registerDataSource(name, dataSource) {
        if (this.dataSources.has(name)) {
            throw new Error(`数据源名称 "${name}" 已存在`);
        }
        this.dataSources.set(name, dataSource);
    }
    getCustomRepository(entity, customRepositoryClass, connectionName = database_constants_1.DEFAULT_CONNECTION_NAME) {
        const dataSource = this.getDataSource(connectionName);
        return repository_factory_1.RepositoryFactory.create(dataSource, entity, customRepositoryClass);
    }
};
exports.DataSourceManagerImpl = DataSourceManagerImpl;
exports.DataSourceManagerImpl = DataSourceManagerImpl = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Map])
], DataSourceManagerImpl);
//# sourceMappingURL=dataSource.manager.js.map