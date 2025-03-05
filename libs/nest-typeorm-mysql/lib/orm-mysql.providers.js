"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseProviders = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const orm_mysql_constants_1 = require("./orm-mysql.constants");
const createDatabaseProviders = () => {
    return [
        {
            provide: orm_mysql_constants_1.DATABASE_CONNECTION,
            useFactory: async (options) => {
                const connections = await Promise.all(options.connections.map((connectionOptions) => (0, typeorm_1.createConnection)(connectionOptions)));
                return connections;
            },
            inject: [orm_mysql_constants_1.DATABASE_MODULE_OPTIONS],
        },
    ];
};
exports.createDatabaseProviders = createDatabaseProviders;
//# sourceMappingURL=orm-mysql.providers.js.map