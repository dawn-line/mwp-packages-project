import { Type } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
export interface DatabaseConnectionOptions extends ConnectionOptions {
    name: string;
}
export interface DatabaseModuleOptions {
    connections: DatabaseConnectionOptions[];
}
export interface EntityMetadata {
    connection: string;
    entity: Type<any>;
}
//# sourceMappingURL=orm-mysql.interface.d.ts.map