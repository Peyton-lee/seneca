'use strict';

const Joi = require('joi');
const _ = require('lodash');
const Constants = require('../../lib/common/constants');
const MongoHelper = require('../../lib/dao/mongo');
const { HTTP_CODE } = Constants;

const rules = {
  address: Joi.object({
    address: Joi.string().required(), // 地址
    city: Joi.string().required(), // 城市
    consignee: Joi.string().required(), // 收件人姓名 
    country: Joi.string().required(), // 国家
    district: Joi.string().required(), // 区域
    email: Joi.string(),
    mobile: Joi.string().required(), // 收件人手机 
    state: Joi.string().required(), // 省
    tel: Joi.string(), // 固定电话
    zipCode: Joi.string() // 邮编
  }),
  addressExtra: Joi.string(),
  attachFee: Joi.number(),
  buyerNickname: Joi.string(), // 购买人昵称 
  buyerPhone: Joi.string(), // 购买人电话
  channel: Joi.string(),
  clientRemark: Joi.string(), // 客户备注
  discountAmount: Joi.number(), // 折扣金额
  expectedShipTime: Joi.number(), // 期望发货时间
  extStrArr1: Joi.array().items(Joi.string()), // 下单人部门IDs
  insureFee: Joi.number(), // 保险费
  internalRemark: Joi.string(), // 内部备注
  invoiceContent: Joi.string(), // 发票内容
  invoicePayee: Joi.string(), // 发票抬头 
  metadata: Joi.object(),
  orderActions: Joi.array().items(Joi.strict()), // 订单action
  orderItems: Joi.array().items(
    Joi.object({
      discountAmount: Joi.number(), // 折扣金额
      discountType: Joi.string(), // 商品折扣类型 
      discountValue: Joi.number(), // 商品折扣类型
      image: Joi.string(),
      orderId: Joi.string(),
      outerSkuId: Joi.string(), // 外部skuId
      preSale: Joi.boolean(),
      price: Joi.number().greater(0), // sku单价
      productId: Joi.number(),
      productName: Joi.string(),
      productUrl: Joi.string(),
      quantity: Joi.number(),
      skuId: Joi.number(),
      skuPropertiesName: Joi.string(), // sku规格值
      skuTitle: Joi.string(), // 规格描述
      totalAmount: Joi.number(), // 商品总金额
      virtual: Joi.boolean()
    })
  ),
  orderSource: Joi.object({
    bizSource: Joi.string(), // 活动类型 
    bookKey: Joi.string(), // 订单唯一识别码
    entrance: Joi.string(), // 平台细分 
    offlineOrder: Joi.boolean(),
    orderRemark: Joi.string(), // 操作内容
    platform: Joi.string() // 平台
  }),
  orderSourceId: Joi.string(), // 订单来源id
  orderStatus: Joi.string(), // 订单状态
  orderTags: Joi.array().items(Joi.string()), // 订单标签
  orderType: Joi.string(), // 订单类型
  outOrderId: Joi.string(), // 第三方订单id 
  parentId: Joi.string(), // 父订单号
  payChannels: Joi.array().items(Joi.string()),
  payFee: Joi.number(), // 支付手续费 
  payStatus: Joi.string(),
  payments: Joi.array().items(
    Joi.object({
      amount: Joi.number().greater(0), // 订单总金额（必须大于 0），单位为对应币种的最小货币单位，人民币为分。如订单总金额为1元
      amountRefunded: Joi.number(), // 已退款总金额，单位为对应币种的最小货币单位，例如：人民币为分 
      amountSettle: Joi.number(), // 清算金额，单位为对应币种的最小货币单位，人民币为分 
      app: Joi.string(), // 业务ID
      body: Joi.string(), // 商品描述信息，该参数最长为 128 个 Unicode 字符。 yeepay_wap 对于该参数长度限制为 100 个 Unicode 字符；支付宝部分渠道不支持特殊字符
      channel: Joi.string(), // 支付渠道
      clientIp: Joi.string(), // 发起支付请求客户端的 IP 地址，格式为 IPv4 整型，如 127.0.0.1 
      credential: Joi.object(), // 支付凭证, 用于客户端发起支付 
      ctime: Joi.number(), // 支付记录创建的时间
      currency: Joi.string(), // 3位ISO货币代码，人民币为cny 
      description: Joi.string(), // 订单附加说明 
      extra: Joi.object(), // 特定渠道发起交易时需要的额外参数，以及部分渠道支付成功返回的额外参数 
      failureCode: Joi.number(), // 支付的错误码, 待定 ,
      failureMsg: Joi.string(), // 支付的错误消息描述
      metadata: Joi.object(), // 用户自定义字段 
      mtime: Joi.number(), // 支付记录最后更新的时间 
      orderId: Joi.string(), // 商户订单号, 必须在商户系统内唯一必须在商户系统内唯一
      paid: Joi.boolean(), // 是否已付款
      refunded: Joi.boolean(), // 是否存在退款信息 
      reversed: Joi.boolean(), // 是否被撤销
      subject: Joi.string(), // 商品标题，该参数最长为 32 个 Unicode 字符。银联全渠道（ upacp / upacp_wap ）限制在 32 个字节；支付宝部分渠道不支持特殊字符
    })
  ),
  platformId: Joi.string(),
  platformUid: Joi.string(),
  productsAmount: Joi.number(),
  shipFee: Joi.number(),
  shipInfo: Joi.object({ // 物流
    addressInf: Joi.object({ // 地址信息 
      address: Joi.string(),
      city: Joi.string(),
      consignee: Joi.string(),
      country: Joi.string(),
      district: Joi.string(),
      email: Joi.string(),
      mobile: Joi.string(),
      state: Joi.string(),
      tel: Joi.string(),
      zipCode: Joi.string(),
    }),
    expressId: Joi.number(), // 快递公司 
    expressInfo: Joi.string(), // 物流信息
    expressNo: Joi.string(), // 快递单号 
    orderId: Joi.string(), // 订单id
    postscript: Joi.string(), // 备注
    shipStatus: Joi.string(), // 物流状态
    shipTime: Joi.number(), // 发货时间 
    signTime: Joi.number() // 签收时间
  }),
  shipNos: Joi.array().items(Joi.string()),
  shopId: Joi.string(), // 店铺id 
  taxFee: Joi.number(), // 税费 
  totalAmount: Joi.number(), // 订单总金额即支付金额 ,
  type: Joi.string(), // 订单类型，决定订单的状态机 
  updateTime: Joi.number(), // 外部订单更新时间
  warehouseId: Joi.number(), // 仓库ID
};

/*
 * @Plugin {order}
 */
module.exports = function order(options) {

  // 初始化创建索引
  this.add({ init: 'order' }, (msg, respond) => {
    const entity = this.make();
    entity.native$((err, db) => {
      db.collection('order').createIndex({ 'ctime': 1 })
      respond();
    })
  });

  this.add({ role: 'api', path: 'order-srv/order/create' }, async (msg, respond) => {
    const result = Joi.object().keys(rules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('order');
    MongoHelper.setData(entity, result.value);
    try {
      const data = await MongoHelper.create(entity);
      this.log.info("create order success, order.id = " + data.id);
      respond(null, { code: HTTP_CODE.OK, msg: '创建订单成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '创建订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/order/retrieve' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }
    const entity = this.make$('order');
    try {
      const data = await MongoHelper.retrieve(entity, result.value.id);
      respond(null, { code: HTTP_CODE.OK, msg: '获取订单成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '获取订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/order/update' }, async (msg, respond) => {
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

    const entity = this.make$('order');
    try {
      const data = await MongoHelper.update(entity, { id: result.value.id }, bodyResult.value);
      respond(null, { code: HTTP_CODE.OK, msg: '更新订单成功', data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '更新订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/order/delete' }, async (msg, respond) => {
    const result = Joi.object().keys({
      id: Joi.strict().required()
    }).validate(msg.args.params);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
      return;
    }

    const entity = this.make$('order');
    try {
      await MongoHelper.delete(entity, { id: result.value.id });
      respond(null, { code: HTTP_CODE.OK, msg: '删除订单成功' });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '删除订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/order/page' }, async (msg, respond) => {
    const result = Joi.object().keys(Constants.pageRules).validate(msg.args.body);
    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('order');
    const body = result.value;
    try {
      const data = await MongoHelper.pageQuery(entity, body.pageNo, body.pageSize, body.filters, body.sort);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '查询订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'order-srv/order/batch' }, async (msg, respond) => {

    const result = Joi.object().keys({
      ids: Joi.array().items(Joi.string())
    }).validate(msg.args.body);

    if (result.error) {
      respond(null, { code: HTTP_CODE.ERROR, error: result.error });
    }

    const entity = this.make$('order');
    try {
      const data = await MongoHelper.batchByIds(entity, result.value.ids);
      respond(null, { code: HTTP_CODE.OK, data });
    } catch (err) {
      respond(null, { code: HTTP_CODE.ERROR, msg: '批量查询订单失败', error: err });
    }
  });

  this.add({ role: 'api', path: 'test' }, async (msg, respond) => {
    const arr = [];
    for(var i = 0;i<10000;i++) {
      arr.push({aa: 1, bb:2, cc: 3, dd:4, ee: 5})
    }
    respond(null, { arr })
  })

};