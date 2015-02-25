'use strict';
var   crypto = require('crypto');

var logError = require('debug')('app:error')
    , hash   = require('../lib/hash')
    , config = require('../config');

module.exports = {
  // check if user is authorised
  // if yes the middleware lets you through
  // if no we abort returning a 401 'Not authorized' error
  is_authorised: function (req, res, next) {
    var tokenString = (req.body && req.body.string_token) || req.headers["ocra-string-token"];
    var token = (req.body && req.body.access_token) || req.headers["ocra-access-token"];

    if (tokenString && token) {
      try {
        // the access token is checked as follows:
        // - take the string passed in "ocra-string-token" (this should be
        // randomly generated each time and long), 
        // - append the secretKey from config,
        // - finally compute the basse64 digest of the sha256 of the resulting string
        // this must match the string passed as "ocras-access-token"
        // TODO: add a check that forbid to use the same string_token again
        var tcompare = hash.hashString(tokenString + config.secretKey);

        if (tcompare == token) {
          next();
        }
      } catch (err) {     
        logError(err);
        res.status(401);
        res.end('Not authorized');
      }
    } else {
      logError("No token provided");
      res.status(401);
      res.end('No access toke provided');
    }
  }
}