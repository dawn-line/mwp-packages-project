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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasClientService = void 0;
const common_1 = require("@nestjs/common");
const nest_cloud_1 = require("@cs/nest-cloud");
const cas_client_constants_1 = require("./cas-client.constants");
let CasClientService = class CasClientService {
    constructor(options, rpcClient) {
        this.options = options;
        this.rpcClient = rpcClient;
    }
    async validateTicket(ticket, actualService) {
        try {
            const service = actualService || this.options.serviceUrl;
            const response = await this.rpcClient.call({
                rpcConfig: {
                    serviceName: 'node-pf-cas-service',
                    servicePath: 'cas',
                },
                payload: {
                    method: 'service-validate.validateServiceTicket',
                    params: {
                        ticket,
                        service,
                        renew: false,
                        format: 'JSON',
                    },
                },
            });
            const serviceResponse = response.result
                ?.serviceResponse;
            if (!!response.result && serviceResponse?.authenticationSuccess?.user) {
                return {
                    userId: serviceResponse.authenticationSuccess.user,
                    attributes: serviceResponse.authenticationSuccess.attributes,
                };
            }
            const failure = serviceResponse?.authenticationFailure;
            throw new common_1.HttpException(failure?.description || 'Invalid ticket', common_1.HttpStatus.UNAUTHORIZED);
        }
        catch (error) {
            throw error;
        }
    }
    getLoginUrl(actualService) {
        const service = encodeURIComponent(actualService || this.options.serviceUrl);
        const loginUrl = `${this.options.casServerUrl}/login.html?service=${service}`;
        return loginUrl;
    }
    async getServiceTicket(tgt, service) {
        const response = await this.rpcClient.call({
            rpcConfig: {
                serviceName: 'node-pf-cas-service',
                servicePath: 'cas',
            },
            payload: {
                method: 'ticket.createST',
                params: {
                    tgtId: tgt,
                    service,
                },
            },
        });
        if (response && 'result' in response) {
            return response.result;
        }
        throw new common_1.HttpException('Failed to get service ticket', common_1.HttpStatus.UNAUTHORIZED);
    }
    async getSessionInfo(sessionId) {
        const response = await this.rpcClient.call({
            rpcConfig: {
                serviceName: 'node-pf-cas-session-service',
                servicePath: 'sessionServer',
            },
            payload: {
                method: 'session.getSession',
                params: {
                    sessionId,
                },
            },
        });
        return response;
    }
    async setSessionInfo(sessionId, userInfo) {
        await this.rpcClient.call({
            rpcConfig: {
                serviceName: 'node-pf-cas-session-service',
                servicePath: 'sessionServer',
            },
            payload: {
                method: 'session.setSession',
                params: {
                    sessionId,
                    userData: userInfo,
                },
                isNotify: true,
            },
        });
    }
};
exports.CasClientService = CasClientService;
exports.CasClientService = CasClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cas_client_constants_1.CAS_CLIENT_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, nest_cloud_1.RpcClient])
], CasClientService);
//# sourceMappingURL=cas-client.service.js.map