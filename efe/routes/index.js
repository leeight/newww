/**
 * @file routes/index.js
 * @author leeight
 */

var express = require('express');

var Package = require('../models/package');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/_search', function (req, res, next) {
  var keyword = req.query.keyword;
  Package.search(keyword)
    .then(function (payload) {
      res.json(payload);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

module.exports = router;
