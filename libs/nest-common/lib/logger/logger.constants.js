"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LOG_CONFIG = exports.DEFAULT_MAX_SIZE = exports.DEFAULT_TASK_LOG_NAME = exports.DEFAULT_SQL_ERROR_LOG_NAME = exports.DEFAULT_SQL_SLOW_LOG_NAME = exports.DEFAULT_ACCESS_LOG_NAME = exports.DEFAULT_ERROR_LOG_NAME = exports.DEFAULT_WEB_LOG_NAME = exports.PROJECT_LOG_DIR_NAME = exports.LOGGER_MODULE_OPTIONS = void 0;
exports.LOGGER_MODULE_OPTIONS = Symbol('LOGGER_MODULE_OPTIONS');
exports.PROJECT_LOG_DIR_NAME = 'logs';
exports.DEFAULT_WEB_LOG_NAME = 'web.log';
exports.DEFAULT_ERROR_LOG_NAME = 'common-error.log';
exports.DEFAULT_ACCESS_LOG_NAME = 'access.log';
exports.DEFAULT_SQL_SLOW_LOG_NAME = 'sql-slow.log';
exports.DEFAULT_SQL_ERROR_LOG_NAME = 'sql-error.log';
exports.DEFAULT_TASK_LOG_NAME = 'task.log';
exports.DEFAULT_MAX_SIZE = '2m';
exports.DEFAULT_LOG_CONFIG = {
    level: 'info',
    timestamp: true,
    disableConsoleAtProd: false,
    maxFileSize: '2m',
    maxFiles: '30',
    appLogName: 'web.log',
    errorLogName: 'error.log',
    dir: './logs',
};
//# sourceMappingURL=logger.constants.js.map