
// require('seneca')()
//   .use(require('./math.js')) // 插件
//   .act('role:math,cmd:sum,left:1,right:2', console.log)

// 服务端 监听
// 它会启动一个进程，并通过 10101 端口监听HTTP请求，它不是一个 Web 服务器，在此时， HTTP 仅仅作为消息的传输机制
// http://localhost:10101/act?role=math&cmd=sum&left=1&right=2
// curl -d '{"role":"math","cmd":"sum","left":1,"right":2}' http://localhost:10101/act
require('seneca')()
  .use(require('./math.js')) // 插件
  .listen({
    port: 10101,
    host: 'localhost',
    spec: {} // 可选
  })