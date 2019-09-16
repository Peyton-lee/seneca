'use strict';
const Constants = require('../../lib/common/constants');

module.exports = {

  isObject(o) {
    return toString.call(o) === '[object Object]'
  },

  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  },

  isMobile = function (mobile) {
    return /^1[3|4|5|7|8|9][0-9]{9}$/.test(mobile)
  },

  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },

  // 转换微信号加星
  convertCustomId(customId) {
    if (!customId) {
      return customId
    }
    return customId.replace(/.{1,2}$/, '**')
  },

  validatePassword(password) {
    return /^(?![\d]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*\(\)\-\+\=]+$)[\da-zA-Z~!@#$%^&*\(\)\-\+\=]{8,20}$/.test(password)
  }
}
