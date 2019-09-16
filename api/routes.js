module.exports = [{
  prefix: '/api/v1',
  pin: 'role:api,path:*',
  // postfix: '/?param=true',
  map: {
    'order-srv/order/create': { POST: true },
    'order-srv/order/retrieve': { GET: true, suffix: '/:id' },
    'order-srv/order/update': { PUT: true, suffix: '/:id' },
    'order-srv/order/delete': { DELETE: true, suffix: '/:id' },
    'order-srv/order/page': { POST: true },
    'order-srv/order/batch': { POST: true, request$: false },

    'order-srv/shop/create': { POST: true },
    'order-srv/shop/retrieve': { GET: true, suffix: '/:id' },
    'order-srv/shop/update': { PUT: true, suffix: '/:id' },
    'order-srv/shop/delete': { DELETE: true, suffix: '/:id' },
    'order-srv/shop/page': { POST: true },


    'order-srv/orderItem/page': { POST: true },
    'order-srv/orderRemark/list': { GET: true, suffix: '/:orderId' },
    'order-srv/orderOperation/list': { GET: true, suffix: '/:orderId' },
  }
}];