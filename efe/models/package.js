/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

var util = require('util');

var Q = require('q');
var request = require('request');
var moment = require('moment');

var config = require('../config');

var kViewNames = {
  modified: 'browseUpdated',
  dependents: 'dependedUpon'
};
var kGroupLevel = {
  modified: 3,
  dependents: 1
};
var kTransformKey = {
  modified: function (k, v) {
    return {
      name: k[1],
      description: k[2] + ' - ' + moment(new Date(k[0])).format('YYYY-MM-DD'),
      url: 'xx',
      value: k[0]
    };
  },
  dependents: function (k, v, type) {
    return {
      name: k[0],
      description: v + ' packages',
      url: 'yy',
      value: v
    };
  }
};

var kDefaultSortKey = 'modified';
var kDefaultLimit = 10;

exports.byName = function (name) {
  var deferred = Q.defer();

  var url = util.format('%s/%s/latest', config.registryCouch, name);
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      deferred.resolve(JSON.parse(body));
    }
    else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

exports.totalCount = function () {
  var deferred = Q.defer();

  var url = util.format('%s/-/_view/browseAll', config.registryCouch);
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      deferred.resolve(JSON.parse(body).rows[0].value);
    }
    else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

exports.search = function (keyword) {
  var deferred = Q.defer();

  // http://edp-registry.baidu.com/-/_view/byField?startkey=%22bat-ria%22&endkey=%22bat-ria%22&limit=10
  var startkey = encodeURIComponent(JSON.stringify(keyword));
  var endkey = encodeURIComponent(JSON.stringify(keyword + '\ufff0'));
  var url = util.format('%s/-/_view/byField?startkey=%s&endkey=%s&limit=10',
      config.registryCouch, startkey, endkey);
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var result = JSON.parse(body);
      var hits = result.rows.map(function (row) {
          return {fields: row.value};
      });
      var payload = {
        hits: {
          total: hits.length,
          hits: hits
        }
      };
      deferred.resolve(payload);
    }
    else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

exports.dependency = function (keyword, limit) {
  var deferred = Q.defer();

  // http://edp-registry.baidu.com/-/_view/needBuild?startkey=%22mini-event%22&endkey=%22mini-event%22
  var startkey = encodeURIComponent(JSON.stringify(keyword));
  var endkey = encodeURIComponent(JSON.stringify(keyword));
  var url = util.format('%s/-/_view/needBuild?startkey=%s&endkey=%s&limit=%s',
      config.registryCouch, startkey, endkey, limit);

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var results = JSON.parse(body).rows.map(function (row) {
          return {name: row.value};
      });
      deferred.resolve({results: results});
    }
    else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

exports.list = function (sortKey, limit, skip) {
  var deferred = Q.defer();

  var descending = (sortKey === kDefaultSortKey);
  var viewName = kViewNames[sortKey];
  var groupLevel = kGroupLevel[sortKey];
  var url = util.format('%s/-/_view/%s?group_level=%s&skip=%s&limit=%s&descending=%s',
      config.registryCouch, viewName, groupLevel, skip, limit, descending);

  request.get(url, function (error, response, body) {
    var payload = {results: []};
    if (!error && response.statusCode === 200) {
      var rows = JSON.parse(body).rows;
      payload.results = rows.map(function (row) {
        var fn = kTransformKey[sortKey];
        return fn(row.key, row.value, sortKey);
      });
    }
    deferred.resolve(payload);
  });

  return deferred.promise;
};









/* vim: set ts=4 sw=4 sts=4 tw=120: */
