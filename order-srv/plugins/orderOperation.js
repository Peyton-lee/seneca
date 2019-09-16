'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  extra: Joi.object(), // 扩展字段
  outerShopId: Joi.string(), // 外部店铺ID
  ownerId: Joi.string(), // 店主
  platformId: Joi.string(), // 平台
  title: Joi.string(), // 标题
  url: Joi.string() // 店铺地址
};

/*
 * @Plugin {orderOperation}
 */
module.exports = function orderOperation(options) {

  this.add({ init: 'orderOperation' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('orderOperation').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderOperation');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create orderOperation success, orderOperation.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单操作成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单操作失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderOperation');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单操作成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单操作失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/update' }, async (msg, respond) => {
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

    const entity = this.make$('orderOperation');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单操作成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单操作失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('orderOperation');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单操作成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单操作失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('orderOperation');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询订单操作失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderOperation/list' }, async (msg, respond) => {
    const result = Joi.object().keys({
      orderId: Joi.string().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('orderOperation');
    try {
      const data = await MongoHelper.find(entity, { orderId: result.value.orderId });
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '批量查询订单操作失败', error: err });
    }
  });

};