const Joi = require('joi');

exports.HTTP_CODE = {
  OK: 0,
  ERROR: -1
}

exports.pageRules = {
  pageNo: Joi.number(),
  pageSize: Joi.number(),
  filters: Joi.object(),
  sort: Joi.array().items(
    Joi.object({
      property: Joi.string(),
      type: Joi.string()
    }))
}