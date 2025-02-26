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
exports.CommonUtil = void 0;
const nanoid_1 = require("nanoid");
const os = __importStar(require("os"));
exports.CommonUtil = {
    disableConsole: function () {
        const originalConsole = { ...console };
        console.log = () => { };
        console.error = () => { };
        console.warn = () => { };
        console.info = () => { };
        console.debug = () => { };
        return originalConsole;
    },
    nanoidKey: function (size = 10) {
        return (0, nanoid_1.nanoid)(size);
    },
    idGenerate: function () {
        return (0, nanoid_1.nanoid)();
    },
    idArrGenerate(arrLength) {
        const idArr = [];
        for (let index = 0; index < arrLength; index++) {
            idArr.push((0, nanoid_1.nanoid)());
        }
        return idArr;
    },
    getRandomString(length) {
        const placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        const customNanoid = (0, nanoid_1.customAlphabet)(placeholder, length);
        return customNanoid();
    },
    getRandomCode(length) {
        const placeholder = '1234567890';
        const customNanoid = (0, nanoid_1.customAlphabet)(placeholder, length);
        return customNanoid();
    },
    getVerSion() {
        return new Date().getTime();
    },
    getIPAdress() {
        const networkInterfaces = os.networkInterfaces();
        for (const devname in networkInterfaces) {
            const iface = networkInterfaces[devname];
            if (iface) {
                for (let index = 0; index < iface.length; index++) {
                    const alias = iface[index];
                    if (alias.family === 'IPv4' &&
                        alias.address !== '127.0.0.1' &&
                        !alias.internal) {
                        return alias.address;
                    }
                }
            }
        }
    },
    getMac() {
        const networkInterfaces = os.networkInterfaces();
        for (const devname in networkInterfaces) {
            const iface = networkInterfaces[devname];
            if (iface) {
                for (let index = 0; index < iface.length; index++) {
                    const alias = iface[index];
                    if (alias.family === 'IPv4' &&
                        alias.address !== '127.0.0.1' &&
                        !alias.internal) {
                        return alias.mac;
                    }
                }
            }
        }
    },
    transRecords(records) {
        const mapFields = {};
        if (records && records.length > 0) {
            const record = records[0];
            for (const field in record) {
                const prop = field.toLowerCase();
                if (field !== prop) {
                    mapFields[field] = prop;
                }
            }
            records.forEach((record) => {
                for (const field in mapFields) {
                    record[mapFields[field]] = record[field];
                    delete record[field];
                }
            });
        }
        return records;
    },
};
//# sourceMappingURL=common.util.js.map