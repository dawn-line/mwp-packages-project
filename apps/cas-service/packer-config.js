// eslint-disable-next-line no-unused-vars
const path = require('path');
module.exports = {
  global: {
    cwd: __dirname,
    clear: ['dist'],
    copy: {
      'src/controllers/config.yaml': 'dist/config.yaml',
      'node_modules/vue/dist': 'dist/lib/vue',
      'node_modules/axios/dist': 'dist/lib/axios',
      'node_modules/vue-router/dist': 'dist/lib/vue-router',
      'node_modules/element-plus/dist': 'dist/lib/element-plus',
    },
    node: {
      rootOutPath: 'dist/',
      packerConfig: {
        node: {
          __dirname: false,
          __filename: false,
          global: true,
        },
        optimization: {
          moduleIds: 'named',
        },
        externals: [
          // 添加不需要打包的node_modules依赖
          // /^@nestjs\/.+$/,
          // 'class-transformer',
          // 'class-validator',
          // 'reflect-metadata',
        ],
      },
    },
    browserVue3: {
      rootOutPath: 'dist/',
      packerConfig: {
        resolve: {
          extensions: ['.js', '.ts', '.json', '.jsx', '.vue'],
        },
        externals: {
          vue: 'Vue',
        },
      },
    },
  },
  entries: {
    server: {
      type: 'node',
      input: 'src/controllers/main.ts',
      output: {
        fileName: 'app',
        filePath: '',
      },
    },
    login: {
      type: 'browserVue3',
      title: '认证中心',
      input: 'src/web-content/module/login/index.ts',
    },
    invalidService: {
      type: 'browserVue3',
      title: '认证中心-认证错误',
      input: 'src/web-content/module/invalid/index.ts',
    },
    home: {
      type: 'browserVue3',
      title: '认证中心-默认主页',
      input: 'src/web-content/module/home/index.ts',
    },
  },
};
