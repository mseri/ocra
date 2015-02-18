'use strict';
var express = require('express');
var app = express();

function getEnv() {
  return app.get('env');
}

module.exports = {
  port: process.env.PORT || 3001,
  env: getEnv(),
  secretKey: '75D2D63A-B510-11E4-B2D5-364DE7861D1D',
  tempLocalPath: 'temp'
};
