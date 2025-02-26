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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const common_1 = require("@nestjs/common");
const http_constants_1 = require("./http.constants");
const axios_1 = __importDefault(require("axios"));
let HttpService = class HttpService {
    constructor(options) {
        this.options = options;
        this.$http = axios_1.default.create(options);
        this.interceptors = options.interceptors;
        this.$http.interceptors.request.use(function (config) {
            if (options.debugAuth) {
                Object.assign(config.headers, {
                    'Content-Type': 'application/json',
                    'x-service-endpoint': '1',
                });
            }
            return config;
        }, function (err) {
            return Promise.reject(err);
        });
        this.$http.interceptors.response.use(function (res) {
            return res;
        }, function (err) {
            return Promise.reject(err);
        });
    }
    request(config) {
        return new Promise((resolve, reject) => {
            if (config.interceptors?.requestInterceptor) {
                config = config.interceptors.requestInterceptor(config);
            }
            this.$http
                .request(config)
                .then((res) => {
                if (config.interceptors?.responseInterceptor) {
                    res = config.interceptors.responseInterceptor(res);
                }
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    get(url, config) {
        return this.request({
            url,
            ...config,
            method: 'GET',
        });
    }
    post(url, data, config) {
        return this.request({
            url,
            ...config,
            data,
            method: 'POST',
        });
    }
    put(url, data, config) {
        return this.request({
            url,
            ...config,
            data,
            method: 'PUT',
        });
    }
    delete(url, data, config) {
        return this.request({
            url,
            ...config,
            data: data,
            method: 'DELETE',
        });
    }
};
exports.HttpService = HttpService;
exports.HttpService = HttpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(http_constants_1.HTTP_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], HttpService);
//# sourceMappingURL=http.service.js.map