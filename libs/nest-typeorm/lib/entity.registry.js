"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEntityMappings = exports.getRegisteredEntities = exports.registerEntity = void 0;
const database_constants_1 = require("./database.constants");
class EntityRegistry {
    static register(connectionName = database_constants_1.DEFAULT_CONNECTION_NAME, entity) {
        if (!this.entities.has(connectionName)) {
            this.entities.set(connectionName, new Set());
        }
        this.entities.get(connectionName).add(entity);
    }
    static getEntities(connectionName = 'default') {
        return this.entities.has(connectionName)
            ? Array.from(this.entities.get(connectionName))
            : [];
    }
    static getAllEntityMappings() {
        const result = new Map();
        this.entities.forEach((entitySet, connectionName) => {
            result.set(connectionName, Array.from(entitySet));
        });
        return result;
    }
}
EntityRegistry.entities = new Map();
exports.registerEntity = EntityRegistry.register.bind(EntityRegistry);
exports.getRegisteredEntities = EntityRegistry.getEntities.bind(EntityRegistry);
exports.getAllEntityMappings = EntityRegistry.getAllEntityMappings.bind(EntityRegistry);
//# sourceMappingURL=entity.registry.js.map