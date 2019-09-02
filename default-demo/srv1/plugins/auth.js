
module.exports = function auth(options) {

  const seneca = this;
  
  this.add('role:api,path:auth/user', (msg, respond) => {
    const apple = seneca.make$('fruit');
    apple.name = 'Pink Lady'
    apple.price = 0.99
    apple.save$((err, apple) => {
      console.log("apple.id = " + apple.id)
    })
    this.log.info(msg);
    respond(null, { ok: 123456 })
  })

  // .list$({f1:v1, f2:v2, ...}) implies pseudo-query f1==v1 AND f2==v2, ....

  // .list$({f1:v1, ..., sort$:{field1:1}}) means sort by f1, ascending.

  // .list$({f1:v1, ..., sort$:{field1:-1}}) means sort by f1, descending.

  // .list$({f1:v1, ..., limit$:10}) means only return 10 results.

  // .list$({f1:v1, ..., skip$:5}) means skip the first 5.

  // .list$({f1:v1, ..., fields$:['fd1','f2']}) means only return the listed fields.

  // .list$({f1:v1, ..., sort$:{field1:-1}, limit$:10}) means sort by f1, descending and only return 10 results


  // // 匹配一组模式
  // this.wrap('role:math', function (msg, respond) {
  //   msg.left = Number(msg.left).valueOf()
  //   msg.right = Number(msg.right).valueOf()
  //   this.prior(msg, respond) // 上一个被重写的模式
  // })
};