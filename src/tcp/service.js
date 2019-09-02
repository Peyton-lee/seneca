
// 服务端 监听
require('seneca')()
  .use(require('./math.js')) // 插件
  .listen({
    type: 'tcp',
    port: 10102,
    host: 'localhost',
    // spec: {}, // 可选
    pin: 'role:math' // 匹配某个服务
  })