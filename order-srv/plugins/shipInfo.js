'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  orderId: Joi.string(), // 订单ID
  shipStatus: Joi.string(), // 物流状态
  expressId: Joi.string(), // 快递公司ID
  expressNo: Joi.string(), // 快递单号
  consignee: Joi.string(), // 收货人
  country: Joi.string(), // 国家
  state: Joi.string(), // 省
  city: Joi.string(), // 市
  district: Joi.string(), // 区
  address: Joi.string(), // 详细地址
  zipCode: Joi.string(), // 邮编
  tel: Joi.string(), // 固定电话
  mobile: Joi.string(), // 手机
  email: Joi.string(), // 邮箱
  postscript: Joi.string(), // 备注
  expressInfo: Joi.string(), // 快递公司信息
  shipTime: Joi.number(), // 发货时间
  signTime: Joi.number(), // 签收时间
};

/*
 * @Plugin {shipInfo}
 */
module.exports = function shipInfo(options) {

  this.add({ init: 'shipInfo' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('shipInfo').createIndex({ 'ctime': 1, 'orderId': 1, 'shipStatus': 1, 'expressNo': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/shipInfo/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('shipInfo');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create shipInfo success, shipInfo.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单物流成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单物流失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shipInfo/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('shipInfo');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单物流成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单物流失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shipInfo/update' }, async (msg, respond) => {
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

    const entity = this.make$('shipInfo');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单物流成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单物流失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shipInfo/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('shipInfo');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单物流成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单物流失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shipInfo/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('shipInfo');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询订单物流失败', error: err });
    }
  });

};