// 异步并行
// const seneca = require('seneca')({ log: 'silent' });

// seneca.add('role:math, cmd:sum', (data, callback) => {
//   setTimeout(() => {
//     callback(null, { answer: data.left + data.right });
//   }, 2000)
// });

// seneca.add('role:math, cmd:product', (data, callback) => {
//   setTimeout(() => {
//     callback(null, { answer: data.left * data.right });
//   }, 2000)
// });

// seneca.act({ role: 'math', cmd: 'sum', left: 1, right: 2 }, console.log)
//   .act({ role: 'math', cmd: 'product', left: 1, right: 5 }, console.log);

// 同步串行
const Promise = require('bluebird');
const seneca = require('seneca')({ timeout: 5000 });

const act = Promise.promisify(seneca.act, { context: seneca });
seneca.add({ cmd: 'timeout' }, (args, done) => {
  setTimeout(() => {
    done(null, { message: 'resolve' });
  }, 1000);
});

// 第一种方式
(async () => {
  const a = await act({ cmd: 'timeout' })
  console.error(a);
})()

//第二种方式
// act({ cmd: 'timeout' })
//   .then(result => {
//     console.error(111111111, result)
//   })
//   .catch(err => {
//     console.error(222222, err)
//   });