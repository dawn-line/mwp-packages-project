"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const common_1 = require("@nestjs/common");
const orm_mysql_constants_1 = require("./orm-mysql.constants");
function Entity(connectionName) {
    return (target) => {
        (0, common_1.SetMetadata)(orm_mysql_constants_1.ENTITY_METADATA, {
            connection: connectionName,
            entity: target,
        })(target);
    };
}
exports.Entity = Entity;
//# sourceMappingURL=orm-mysql.decorators.js.map