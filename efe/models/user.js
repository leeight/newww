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

var config = require('../config');
var helper = require('./helper');

exports.byName = function (username) {
  var deferred = Q.defer();

  // http://edp-registry.baidu.com/_users/org.couchdb.user:ecomfe
  var url = util.format('%s/_users/org.couchdb.user:%s', config.registryCouch, username);
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

exports.starredPackages = function (username) {
  var deferred = Q.defer();

  var startkey = encodeURIComponent(JSON.stringify(username));
  var endkey = startkey;
  var url = util.format('%s/-/_view/starredByUser?startkey=%s&endkey=%s',
      config.registryCouch, startkey, endkey);

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var packages = JSON.parse(body).rows.map(function (row) {
        return row.value;
      });
      deferred.resolve(packages);
    }
    else {
      deferred.resolve(null);
    }
  });

  return deferred.promise;
};

exports.ownedPackages = function (username) {
  var deferred = Q.defer();

  var startkey = encodeURIComponent(JSON.stringify(username));
  var endkey = startkey;
  var url = util.format('%s/-/_view/byUser?startkey=%s&endkey=%s',
      config.registryCouch, startkey, endkey);

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var packages = JSON.parse(body).rows.map(function (row) {
        return {name: row.value, description: row.value + ' description'};
      });
      deferred.resolve({
        count: packages.length,
        items: packages,
        hasMore: false
      });
    }
    else {
      deferred.resolve(null);
    }
  });

  return deferred.promise;
};

exports.login = function (username, password) {
  return helper.delay({
    name: username,
    email: 'leeight@gmail.com',
    resource: {
      mustChangePass: false
    }
  });

  var deferred = Q.defer();

  /*
  var url = util.format('%s/%s/latest', config.registryCouch, name);
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      deferred.resolve(JSON.parse(body));
    }
    else {
      deferred.reject(error);
    }
  });
  */
  setTimeout(function () {
    deferred.resolve({
      name: username,
      email: 'leeight@gmail.com',
      resource: {
        mustChangePass: false
      }
    });
  }, 50);

  return deferred.promise;
};










/* vim: set ts=4 sw=4 sts=4 tw=120: */
