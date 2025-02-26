"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipTransformInterceptor = exports.SKIP_TRANSFORM_INTERCEPTOR = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_TRANSFORM_INTERCEPTOR = 'SKIP_TRANSFORM_INTERCEPTOR';
const skipTransformInterceptor = () => (0, common_1.SetMetadata)(exports.SKIP_TRANSFORM_INTERCEPTOR, true);
exports.skipTransformInterceptor = skipTransformInterceptor;
//# sourceMappingURL=interceptor.decorator.js.map