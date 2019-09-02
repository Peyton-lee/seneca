
module.exports = require('seneca')()
  // 本地模式
  // .add('srv:hello', function (msg, respond) { respond(null, { text: "Hi!" }) })

  // 发送 srv:auth 模式至服务
  // 注意：必须匹配服务端
  .client({
    type: 'tcp',
    port: 10102,
    host: 'localhost',
    pin: 'role:api'
  })