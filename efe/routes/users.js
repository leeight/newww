/**
 * @file routes/users.js
 * @author leeight
 */

var express = require('express');

var User = require('../models/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:name', function (req, res, next) {
  var name = req.params.name;

  User.byName(name)
    .then(function (user) {
      res.json(user);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

// /user/ecomfe/stars?format=detailed
router.get('/:name/stars', function (req, res, next) {
  User.starredPackages(req.params.name)
    .then(function (packages) {
      res.json(packages);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

// /user/ecomfe/package?format=mini&per_page=100&page=0
router.get('/:name/package', function (req, res, next) {
  User.ownedPackages(req.params.name)
    .then(function (result) {
      res.json(result);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

router.post('/:name/login', function (req, res, next) {
  var name = req.params.name;
  var password = req.body.password;

  User.login(name, password)
    .then(function (payload) {
      res.json(payload);
    })
    .fail(function (error) {
      res.status(500).json({error: error});
    });
});

module.exports = router;
