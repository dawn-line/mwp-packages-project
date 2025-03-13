import { EntityClassOrSchema } from './database.types';
import { DEFAULT_CONNECTION_NAME } from './database.constants';
class EntityRegistry {
  private static entities: Map<string, Set<EntityClassOrSchema>> = new Map();

  static register(
    connectionName = DEFAULT_CONNECTION_NAME,
    entity: EntityClassOrSchema,
  ): void {
    if (!this.entities.has(connectionName)) {
      this.entities.set(connectionName, new Set());
    }
    this.entities.get(connectionName).add(entity);
  }

  static getEntities(connectionName = 'default'): EntityClassOrSchema[] {
    return this.entities.has(connectionName)
      ? Array.from(this.entities.get(connectionName))
      : [];
  }

  static getAllEntityMappings(): Map<string, EntityClassOrSchema[]> {
    const result = new Map<string, EntityClassOrSchema[]>();
    this.entities.forEach((entitySet, connectionName) => {
      result.set(connectionName, Array.from(entitySet));
    });
    return result;
  }
}

/**
 * 注册实体到指定连接
 * @param connectionName 连接名称，默认为 'default'
 * @param entity 实体类
 */
export const registerEntity = EntityRegistry.register.bind(EntityRegistry);

/**
 * 获取指定连接的所有注册实体
 * @param connectionName 连接名称，默认为 'default'
 */
export const getRegisteredEntities =
  EntityRegistry.getEntities.bind(EntityRegistry);

/**
 * 获取所有连接的实体映射
 */
export const getAllEntityMappings =
  EntityRegistry.getAllEntityMappings.bind(EntityRegistry);
