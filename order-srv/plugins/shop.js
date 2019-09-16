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
 * @Plugin {shop}
 */
module.exports = function shop(options) {

  this.add({ init: 'shop' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('shop').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/shop/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('shop');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create shop success, shop.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建店铺成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建店铺失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shop/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('shop');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取店铺成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取店铺失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shop/update' }, async (msg, respond) => {
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

    const entity = this.make$('shop');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新店铺成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新店铺失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shop/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('shop');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除店铺成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除店铺失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/shop/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('shop');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询店铺失败', error: err });
    }
  });

};