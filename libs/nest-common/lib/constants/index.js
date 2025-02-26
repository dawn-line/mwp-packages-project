"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EHttpExtendStatus = exports.EHttpStatus = void 0;
var EHttpStatus;
(function (EHttpStatus) {
    EHttpStatus["Error"] = "error";
    EHttpStatus["Success"] = "success";
})(EHttpStatus || (exports.EHttpStatus = EHttpStatus = {}));
var EHttpExtendStatus;
(function (EHttpExtendStatus) {
    EHttpExtendStatus[EHttpExtendStatus["INTERNAL_RPC_SERVER_ERROR"] = 508] = "INTERNAL_RPC_SERVER_ERROR";
    EHttpExtendStatus[EHttpExtendStatus["INTERNAL_RPC_SERVER_TIMEOUT"] = 509] = "INTERNAL_RPC_SERVER_TIMEOUT";
})(EHttpExtendStatus || (exports.EHttpExtendStatus = EHttpExtendStatus = {}));
//# sourceMappingURL=index.js.map