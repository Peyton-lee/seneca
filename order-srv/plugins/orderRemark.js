'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  orderId: Joi.string(), // 订单ID
  creatorId: Joi.string(), // 创建人ID
  creatorName: Joi.string(), // 创建人姓名
  content: Joi.string(), // 内容
};

/*
 * @Plugin {orderRemark}
 */
module.exports = function orderRemark(options) {

  this.add({ init: 'orderRemark' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('orderRemark').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/orderRemark/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderRemark');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create orderRemark success, orderRemark.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单备注成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单备注失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderRemark/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderRemark');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单备注成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单备注失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderRemark/update' }, async (msg, respond) => {
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

    const entity = this.make$('orderRemark');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单备注成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单备注失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderRemark/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('orderRemark');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单备注成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单备注失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderRemark/list' }, async (msg, respond) => {
    const result = Joi.object().keys({
      orderId: Joi.string().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('orderRemark');
    try {
      const data = await MongoHelper.find(entity, { orderId: result.value.orderId });
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '批量查询订单备注失败', error: err });
    }
  });

};