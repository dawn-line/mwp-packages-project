"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcClient = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class JsonRpcClient {
    constructor(rpcConfig) {
        this.rpcConfig = rpcConfig;
        this.axiosInstance = axios_1.default.create({
            timeout: rpcConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
                'x-rpc-request': 'true',
            },
        });
    }
    async call(requestClient, reqOptions) {
        try {
            const { req, url } = requestClient;
            const request = {
                jsonrpc: '2.0',
                id: !req.isNotify ? (0, uuid_1.v4)() : null,
                method: req.method,
                params: req.params,
            };
            console.log('request', request, url, reqOptions);
            if (req.isNotify) {
                this.sendNotification(request, url, reqOptions);
                return;
            }
            const response = await this.sendRequest(request, url, reqOptions);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async sendNotification(request, url, reqOptions) {
        await this.axiosInstance.post(url, request, reqOptions);
    }
    async sendRequest(request, url, reqOptions) {
        const response = await this.axiosInstance.post(url, request, reqOptions);
        return response.data;
    }
}
exports.JsonRpcClient = JsonRpcClient;
//# sourceMappingURL=client.js.map