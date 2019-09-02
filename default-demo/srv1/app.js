
'use strict';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const ServiceConfs = IS_DEBUG ? require('./configs/service.dev.json') : require('./configs/service.prod.json');
const DBConfs = IS_DEBUG ? require('./configs/db.dev.json') : require('./configs/db.prod.json');

require('seneca')()
  .test('print')
  .use("entity", { mem_store: false })
  .use('mongo-store', DBConfs['mongoDomain'])
  .use(require('./plugins/auth'))
  .listen(ServiceConfs["seneca-srv1"])
  // .listen({
  //   type: 'tcp',
  //   port: 3001,
  //   host: 'seneca-srv1',
  //   // spec: {}, // 可选
  //   pin: 'role:api,path:*' // 匹配某个服务
  // })