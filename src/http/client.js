// 客户端
require('seneca')()
  .client({
    port: 10101,
    host: 'localhost'
  })
  .act('role:math,cmd:sum,left:1,right:2', console.log)