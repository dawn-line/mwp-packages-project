"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseProviders = void 0;
const database_constants_1 = require("./database.constants");
const createDatabaseProviders = (options) => {
    if (options.useFactory) {
        return [
            {
                provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            },
        ];
    }
    if (options.useClass) {
        return [
            {
                provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                useFactory: async (optionsFactory) => await optionsFactory.createDatabaseOptions(),
                inject: [options.useClass],
            },
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    if (options.useExisting) {
        return [
            {
                provide: database_constants_1.DATABASE_MODULE_OPTIONS,
                useFactory: async (optionsFactory) => await optionsFactory.createDatabaseOptions(),
                inject: [options.useExisting],
            },
        ];
    }
    return [];
};
exports.createDatabaseProviders = createDatabaseProviders;
//# sourceMappingURL=database.providers.js.map