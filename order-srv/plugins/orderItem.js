'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  orderId: Joi.string(), // 订单ID
  skuId: Joi.number(), // skuID
  productId: Joi.number(), // 商品ID
  productName: Joi.string(), // 商品名
  isVirtual: Joi.boolean(), // 是否是虚拟商品
  price: Joi.number().greater(0), // 单价 单位分
  quantity: Joi.number().greater(0), // 数量
  discountAmount: Joi.number(), // 折扣金额
  skuTitle: Joi.string(), // sku标题
  image: Joi.string(), // 商品图片
  discountValue: Joi.string(),
  discountType: Joi.number(),
  totalAmount: Joi.number().greater(0), // 商品总金额
  outerSkuId: Joi.string(), // 外部skuID
  productUrl: Joi.string(), // 商品链接
  skuPropertiesName: Joi.string(), // 规格值
  isPreSale: Joi.boolean(), // 是否预售

};

/*
 * @Plugin {orderItem}
 */
module.exports = function orderItem(options) {

  this.add({ init: 'orderItem' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('orderItem').createIndex({ 'ctime': 1, 'orderId': 1, 'skuId': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/orderItem/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderItem');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create orderItem success, orderItem.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单项成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单项失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderItem/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderItem');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单项成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单项失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderItem/update' }, async (msg, respond) => {
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

    const entity = this.make$('orderItem');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单项成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单项失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderItem/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('orderItem');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单项成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单项失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderItem/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('orderItem');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询订单项失败', error: err });
    }
  });

};