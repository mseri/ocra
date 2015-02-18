'use strict';

var request = require('supertest')
  , express = require('express')
  , hash    = require('../lib/hash')
  , jwt     = require('jsonwebtoken')
  , config  = require('../config')
  , log     = require('debug')('app');

var imageName =  __dirname + '/IMG_4300.JPG';
var sha1Image = "748fa97bd26133c7b0f514fb68f4ba394bad46b200a777cbdab90dd0a0b0799d";

var app = require('../app');

app.set('port', config.port);

var server = app.listen(app.get('port'), function () {
    log('Server listening on port ' + server.address().port);
});

request(app)
  .post('/upload')
  .set('x-access-token', jwt.sign({ authorized: true }, config.secretKey ))
  .set('x-custom-sha1', sha1Image)
  .type('form')
  .attach('image', imageName)
  .expect(200)
  .end(function (err, res) {
      var form = res.body;
      log(form);
      
      if (err) {
        log(err);
      }
      server.close();
  });