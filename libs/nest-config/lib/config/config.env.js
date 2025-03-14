"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEnvConfig = void 0;
const os = __importStar(require("os"));
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (iface) {
            for (const alias of iface) {
                if (alias.family === 'IPv4' &&
                    alias.address !== '127.0.0.1' &&
                    !alias.internal) {
                    return alias.address;
                }
            }
        }
    }
    return 'localhost';
};
exports.defaultEnvConfig = {
    host: getLocalIP() || '127.0.0.1',
    port: 8080,
    name: 'nest-app-server',
    serverPath: '',
    env: 'dev',
    docs: {
        name: '文档标题',
        describe: '文档描述',
        version: 1.0,
    },
    ipIntercept: false,
    innerServer: '',
    cors: {
        enable: false,
        address: '*',
    },
};
//# sourceMappingURL=config.env.js.map