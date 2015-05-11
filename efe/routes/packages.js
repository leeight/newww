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
var express = require('express');

var Package = require('../models/package');

var router = express.Router();

/* GET package list. */
// /package?sort=modified&count=36&offset=0
router.get('', function (req, res, next) {
  // http://edp-registry.baidu.com/-/_view/dependedUpon?group_level=1&skip=0&limit=10
  // query: { sort: 'modified', count: '36', offset: '0' }
  // query: { sort: 'dependents': count: '36', offset: '0' }
  var sortKey = req.query.sort || 'modified';
  var limit = parseInt(req.query.count || 12, 10);
  var skip = parseInt(req.query.offset || 0, 10);

  if (req.query.dependency) {
    var keyword = req.query.dependency;
    Package.dependency(keyword, limit)
      .then(function (payload) {
        res.json(payload);
      })
      .fail(function (error) {
        res.status(500).json({error: error});
      });
  }
  else {
    Q.all([Package.totalCount(), Package.list(sortKey, limit, skip)])
      .then(function (results) {
        var totalCount = results[0];
        var payload = results[1];
        payload.hasMore = (skip + limit) < totalCount;
        if (payload.hasMore) {
          payload.offset = (skip + limit);
        }
        res.json(payload);
      })
      .fail(function (error) {
        res.status(500).json({error: error});
      });
  }
});

/* GET package count. */
router.get('/-/count', function (req, res, next) {
  Package.totalCount()
    .then(function (count) {
      res.end('' + count);
    })
    .fail(function () {
      res.end('0');
    });
});

/* GET package detail */
router.get('/:name', function (req, res, next) {
  Package.byName(req.params.name)
    .then(function (body) {
      res.json(body);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

module.exports = router;










/* vim: set ts=4 sw=4 sts=4 tw=120: */
