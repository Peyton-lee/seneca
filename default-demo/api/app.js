'use strict';

const express = require('express');
const Seneca = require('seneca');
const SenecaWeb = require('seneca-web');
const routes = require('./routes');
const IS_DEBUG = process.env.NODE_ENV !== 'production';
const ServiceConfs = IS_DEBUG ? require('./configs/service.dev.json') : require('./configs/service.prod.json');

const seneca = Seneca()
  // .quiet() 安静模式

  // 详细日志
  .test('print')
  .use(SenecaWeb, {
    context: express(),
    adapter: require('seneca-web-adapter-express'),
    routes,
  })
  .client(ServiceConfs['seneca-srv1'])
  .ready(() => {
    const app = seneca.export('web/context')();
    app.use(require('body-parser').json());
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`server started on: ${port}`);
    });
  });

