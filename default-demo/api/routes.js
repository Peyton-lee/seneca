module.exports = [{
  prefix: '/api/v1',
  pin: 'role:api,path:*',
  map: {
    'auth/user': {
      GET: true,
      // suffix: '/{operation}'
    },
    store: {
      GET: true,
      POST: true,
      suffix: '/{operation}'
    }
  }
}];