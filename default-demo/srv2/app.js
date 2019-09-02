const Promise = require('bluebird');
const client = require('./client');

const act = Promise.promisify(client.act, { context: client });

act('role:api,path:auth/user/get,name:peyton')
  .then((result) => {
    console.info('result:', result)
  }).catch(e => {
    console.error('srv:auth,model:user,cmd:get', e)
  })