'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  orderId: Joi.string(), // 订单ID
  isOfflineOrder: Joi.boolean(), // 是否来自线下订单
  bookKey: Joi.string(), // 订单唯一识别码
  bizSource: Joi.string(), // 活动类型：如群团购：mall_group_buy
  platform: Joi.string(), // 平台 wx:微信; merchant_3rd:商家自有app; buyer_v:买家版; browser:系统浏览器; alipay:支付宝;qq:腾讯QQ; wb:微博; other:其他
  entrance: Joi.string(), // 如果是微信平台,细分入口:  wx_gzh:微信公众号; yzdh:有赞大号; merchant_xcx:商家小程序; yzdh_xcx:有赞大号小程序; direct_buy:直接购买
  orderRemark: Joi.string() // 订单标记
};

/*
 * @Plugin {orderSource}
 */
module.exports = function orderSource(options) {

  this.add({ init: 'orderSource' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('orderSource').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/orderSource/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderSource');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create orderSource success, orderSource.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单来源成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单来源失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderSource/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('orderSource');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单来源成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单来源失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderSource/update' }, async (msg, respond) => {
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

    const entity = this.make$('orderSource');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单来源成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单来源失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderSource/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('orderSource');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单来源成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单来源失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/orderSource/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('orderSource');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询订单来源失败', error: err });
    }
  });

};