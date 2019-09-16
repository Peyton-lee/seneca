// const Promise = require('bluebird');
// const client = require('./client');

// const act = Promise.promisify(client.act, { context: client });

// act('role:api,path:auth/user/get,name:peyton')
//   .then((result) => {
//     console.info('result:', result)
//   }).catch(e => {
//     console.error('srv:auth,model:user,cmd:get', e)
//   })

'use strict';

const IS_DEBUG = process.env.NODE_ENV !== 'production';
const ServiceConfs = IS_DEBUG ? require('../configs/service.dev.json') : require('../configs/service.prod.json');
const DBConfs = IS_DEBUG ? require('../configs/db.dev.json') : require('../configs/db.prod.json');

require('seneca')()
  .test('print')
  .use("entity", { mem_store: false })
  .use('seneca-joi', {
    joi: { allowUnknown: true } // example of passing in Joi options
  })
  .use('mongo-store', DBConfs['order_srv'])
  .use(require('./plugins/order'))
  .listen(ServiceConfs["order-srv"])