'use strict';

var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = {
  // check if user is authorised
  // if yes the middleware lets you through
  // if no we abort returning a 401 'Not authorized' error
  is_authorised: function (req, res, next) {
    var token = (req.body && req.body.access_token) || req.headers["x-access-token"];

    if (token) {
      try {
        var decoded = jwt.verify(token, config.secretKey);
        if (decoded.authorized == true) {
          next();
        }
      } catch (err) {     
        logError(err);
      }
    } else {
      logError("No token provided");
    }

    res.end('Not authorized', 401);
  }
}