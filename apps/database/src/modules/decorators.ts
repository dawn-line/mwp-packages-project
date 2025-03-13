import { Inject } from '@nestjs/common';
import { DATA_SOURCE_MANAGER } from '@cs/nest-typeorm';

/**
 * 装饰器用于注入数据源管理器
 */
export const InjectDataSourceManager = () => Inject(DATA_SOURCE_MANAGER);
