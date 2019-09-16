'use strict';

const express = require('express');
const Seneca = require('seneca');
const SenecaWeb = require('../lib/seneca-web');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes');
const adapter = require('../lib/seneca-web-adapter-express');
const IS_DEBUG = process.env.NODE_ENV !== 'production';
const ServiceConfs = IS_DEBUG ? require('../configs/service.dev.json') : require('../configs/service.prod.json');

const seneca = Seneca()
  // .quiet() 安静模式

  // 详细日志
  .test('print')
  .use(SenecaWeb, {
    context: (() => {
      const app = express();
      app.use(bodyParser.json());
      app.use(compression());
      app.use(bodyParser.urlencoded({ extended: false }))
      app.use(cookieParser());
      return app;
    })(),
    adapter,
    routes,
  })
  .use("entity", {
    mem_store: false
  })
  .client(ServiceConfs['seneca-srv1'])
  .client(ServiceConfs['order-srv'])
  .ready(async () => {
    const app = seneca.export('web/context')();
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Api Server listen on: ${port}`);
    });
  });

