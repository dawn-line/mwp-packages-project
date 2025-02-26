export abstract class RootService {
  root(): object {
    return {
      msg: `${process.env.CS_NAME} 服务已经启动!`,
    };
  }
}
