'use strict';
const async = require('async');
const _ = require('lodash');
const objectId = require('mongodb').ObjectId;

const parseFilters = filter => {
  const mongoFilter = {};
  _.map(filter, (val, key) => {
    const param = mongoFilter[key] = {};
    _.map(val, (fVal, fKey) => {
      switch (fKey) {
        case 'EQ':
          mongoFilter[key] = fVal;
          break;
        case 'NE':
          param['$ne'] = fVal;
          break;
        case 'IN':
          param['$in'] = fVal;
          break;
        case 'NOT_IN':
          param['$nin'] = fVal;
          break;
        case 'LIKE':
          mongoFilter[key] = new RegExp(fVal);
          break;
        case 'GT':
          param['$gt'] = fVal;
          break;
        case 'LT':
          param['$lt'] = fVal;
          break;
        case 'GTE':
          param['$gte'] = fVal;
          break;
        case 'LTE':
          param['$lte'] = fVal;
          break;
        default:
          break;
      }
    });
  });
  return mongoFilter;
};

const pageQuery = (Model, pageNo, pageSize, filter, sorts, selects, noCountFlag) => {
  pageNo = pageNo || 1;
  pageSize = pageSize || 10;
  filter = filter || {};
  selects = selects || [];
  sorts = sorts || [{ property: 'ctime', type: 'DESC' }];

  const skip$ = (pageNo - 1) * pageSize,
    limit$ = pageSize,
    sort$ = {};

  sorts.forEach(s => {
    sort$[s.property] = s.type == 'DESC' ? -1 : 1;
  })

  const mongoFilter = parseFilters(filter);
  const page = { pageNo, pageSize };

  return new Promise((resolve, reject) => {
    async.parallel({
      count: callback => {
        if (!noCountFlag) {
          Model.native$((err, db) => {
            if (err) callback(err);
            // 获取表名 有坑
            const collection = db.collection(/[a-zA-Z_]+/.exec(Model.entity$)[0]);
            const filter = { ...mongoFilter };
            // 框架把_id换成id 这里是原生需要转换
            if (filter.id) {
              filter._id = { $eq: objectId(filter.id) }
              delete filter.id;
            }
            collection.count(filter, (err, count) => {
              if (err) {
                callback(err);
                return;
              };
              callback(null, count);
            });
          });
        } else {
          callback(null, 0);
        }
      },

      records: callback => {
        const filter = { ...mongoFilter, skip$, limit$, sort$ };
        if (selects.length) {
          filter.select = {};
          selects.forEach(select => {
            filter.select[select] = 1;
          })
        }
        Model.list$(filter, (err, list) => {
          if (err) {
            callback(err, []);
            return;
          };
          callback(null, list.map(entity => entity.data$(false)));
        })
      },

    }, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      if (!noCountFlag) {
        page.total = results.count;
        page.pageCount = parseInt((page.total - 1) / pageSize) + 1;
      }
      page.content = results.records;

      resolve(page);
    });
  });
};

const create = (Model) => {
  !Model.ctime && (Model.ctime = new Date().getTime());
  !Model.mtime && (Model.mtime = Model.ctime);
  return new Promise((resolve, reject) => {
    Model.save$((err, entity) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(entity.data$(false));
    })
  })
};

const retrieve = (Model, id) => {
  return new Promise((resolve, reject) => {
    Model.load$({ id }, (err, entity) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(entity.data$(false));
    });
  })
};

const update = (Model, conditions, data) => {
  return new Promise((resolve, reject) => {
    Model.load$(conditions, (err, entity) => {
      if (err || !entity) {
        reject(err || new Error('查无此ID数据,无法更新'));
        return;
      }
      setData(entity, data);
      entity.mtime = new Date().getTime();
      entity.save$(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(entity.data$(false));
      })
    })
  })
}

// 更新deleted字段
const delete2 = (Model, conditions) => {
  return new Promise((resolve, reject) => {
    Model.load$(conditions, (err, entity) => {
      if (err || !entity) {
        reject(err || new Error('查无此ID对应数据'));
        return;
      }
      entity.deleted = true;
      entity.save$(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(entity);
      })
    })
  })
};

// 清除数据
const remove = (Model, conditions) => {
  return new Promise(resolve, reject => {
    Model.load$(conditions, (err, entity) => {
      if (err || !entity) {
        reject(err || new Error('查无此ID对应数据'));
        return;
      }
      entity.remove$(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      })
    })
  })
};

const find = (Model, conditions) => {
  return new Promise((resolve, reject) => {
    Model.list$(conditions, (err, list) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(list.map(entity => entity.data$(false)));
    })
  })
};

const batchByIds = (Model, ids) => {
  return find(Model, { _id: { $in: ids.map(id => objectId(id)) } });
}

const setData = (Model, data) => {
  if (!Model || !data || typeof data !== 'object') return Model;
  for (let key in data) {
    Model[key] = data[key];
  }
  return Model;
};

module.exports = {
  pageQuery,
  create,
  retrieve,
  update,
  delete: delete2,
  remove,
  find,
  batchByIds,
  setData,
};
