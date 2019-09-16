'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  name: Joi.string(), // 名称
  disabled: Joi.boolean(), // 是否禁用
  website: Joi.string(), // 网址
  deleted: Joi.boolean(), // 是否删除
};

/*
 * @Plugin {express}
 */
module.exports = function express(options) {

  this.add({ init: 'express' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('express').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/express/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('express');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create express success, express.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建快递成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建快递失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/express/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('express');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取快递成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取快递失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/express/update' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const bodyResult = Joi.object().keys(rules).validate(msg.args.body);
    if (bodyResult.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: bodyResult.error });
      return;
    }

    const entity = this.make$('express');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新快递成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新快递失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/express/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('express');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除快递成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除快递失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/express/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('express');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询快递失败', error: err });
    }
  });

};