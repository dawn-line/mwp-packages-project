import { EntityClassOrSchema } from './database.types';
declare class EntityRegistry {
    private static entities;
    static register(connectionName: string, entity: EntityClassOrSchema): void;
    static getEntities(connectionName?: string): EntityClassOrSchema[];
    static getAllEntityMappings(): Map<string, EntityClassOrSchema[]>;
}
export declare const registerEntity: typeof EntityRegistry.register;
export declare const getRegisteredEntities: typeof EntityRegistry.getEntities;
export declare const getAllEntityMappings: typeof EntityRegistry.getAllEntityMappings;
export {};
//# sourceMappingURL=entity.registry.d.ts.map