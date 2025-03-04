export declare const LOGGER_MODULE_OPTIONS: unique symbol;
export declare const PROJECT_LOG_DIR_NAME = "logs";
export declare const DEFAULT_WEB_LOG_NAME = "web.log";
export declare const DEFAULT_ERROR_LOG_NAME = "common-error.log";
export declare const DEFAULT_ACCESS_LOG_NAME = "access.log";
export declare const DEFAULT_SQL_SLOW_LOG_NAME = "sql-slow.log";
export declare const DEFAULT_SQL_ERROR_LOG_NAME = "sql-error.log";
export declare const DEFAULT_TASK_LOG_NAME = "task.log";
export declare const DEFAULT_MAX_SIZE = "2m";
export declare const DEFAULT_LOG_CONFIG: {
    level: string;
    timestamp: boolean;
    disableConsoleAtProd: boolean;
    maxFileSize: string;
    maxFiles: string;
    appLogName: string;
    errorLogName: string;
    dir: string;
};
//# sourceMappingURL=logger.constants.d.ts.map