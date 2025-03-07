import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  DATABASE_MODULE_OPTIONS,
  DATABASE_CONNECTIONS,
} from './database.constants';
import { DatabaseModuleOption } from './database.types';

@Injectable()
export class DBService {
  constructor(
    @Inject(DATABASE_MODULE_OPTIONS)
    private dbConfig: DatabaseModuleOption,
    // @Inject(DATABASE_CONNECTIONS)
    // private connections: Map<string, DataSource>,
  ) {
    // 在此方法中注入数据库配置
  }
  async onModuleInit() {
    // 确保所有连接都已初始化（安全检查）
    // for (const [name, connection] of this.connections.entries()) {
    //   if (!connection.isInitialized) {
    //     try {
    //       await connection.initialize();
    //       console.log(`数据库连接 "${name}" 初始化成功`);
    //     } catch (error) {
    //       console.error(`数据库连接 "${name}" 初始化失败:`, error);
    //       throw error;
    //     }
    //   }
    // }
  }

  /**
   * 获取指定名称的数据库连接
   */
  // getConnection(name: string): DataSource {
  //   if (!this.connections.has(name)) {
  //     throw new Error(`数据库连接 "${name}" 不存在`);
  //   }
  //   return this.connections.get(name);
  // }

  // /**
  //  * 获取所有数据库连接
  //  */
  // getAllConnections(): Map<string, DataSource> {
  //   return this.connections;
  // }
}
