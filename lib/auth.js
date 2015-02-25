'use strict';
var   crypto = require('crypto');

var logError = require('debug')('app:error')
    , config = require('../config');

module.exports = {
  // check if user is authorised
  // if yes the middleware lets you through
  // if no we abort returning a 401 'Not authorized' error
  is_authorised: function (req, res, next) {
    var token = (req.body && req.body.access_token) || req.headers["ocra-access-token"];

    if (token && config.secretKey == token) {
      next();
    } else {
      logError("Not authorised");
      res.status(401);
      res.end('Not authorised');
    }
  }
}