
'use strict';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const ServiceConfs = IS_DEBUG ? require('../configs/service.dev.json') : require('../configs/service.prod.json');
const DBConfs = IS_DEBUG ? require('../configs/db.dev.json') : require('../configs/db.prod.json');

require('seneca')()
  .test('print')
  .use("entity", { mem_store: false })
  .use('mongo-store', DBConfs['mongoDomain'])
  .use(require('./plugins/auth'))
  .listen(ServiceConfs["order-srv"])