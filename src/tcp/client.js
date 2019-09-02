

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, { context: seneca });
seneca
  // 本地模式
  .add('say:hello', function (msg, respond) { respond(null, { text: "Hi!" }) })

  // 发送 role:math 模式至服务
  // 注意：必须匹配服务端
  .client({
    type: 'tcp',
    port: 10102,
    host: 'localhost',
    pin: 'role:math'
  })

  // 远程操作 promise写法在下面注释的地方
  .act('role:math,cmd:sum,left:1,right:2', console.log)

  // 本地操作
  .act('say:hello', console.log)


// 远程操作
// act('role:math,cmd:sum,left:1,right:2').then((result) => {
//   console.error(result)
// }).catch(e => {
//   console.error(11111, e)
// })