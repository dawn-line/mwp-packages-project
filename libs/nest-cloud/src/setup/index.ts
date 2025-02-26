import { SetupStrategy } from './setup.interface'
import { LoggerConfigStrategy } from './logger.setup';
import { MiddlewareStrategy } from './middleware.setup';
import { InterceptorsStrategy } from './interceptors.setup';
import { PipesStrategy } from './pipes.setup';
import { FilterStrategy } from './filter.setup';
import { BodyParserStrategy } from './bodyParser.setup';
import { SwaggerStrategy } from './swagger.setup';
import { StartedStrategy } from './started.setup';
// 启动处理配置项
export const configStrategyMap: { [key: string]: typeof SetupStrategy } = {
  logger: LoggerConfigStrategy, // 日志配置
  middlewareStrategy: MiddlewareStrategy, //  中间件配置
  interceptorsStrategy: InterceptorsStrategy, // 拦截器配置
  pipesStrategy: PipesStrategy, // 管道配置
  filterStrategy: FilterStrategy, // 过滤器配置
  bodyParser: BodyParserStrategy, // body解析配置
  docs: SwaggerStrategy, // 文档配置
  started: StartedStrategy, // 启动配置
};
