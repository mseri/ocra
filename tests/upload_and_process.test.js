'use strict';

var request = require('supertest')
  , express = require('express')
  , hash    = require('../lib/hash')
  , jwt     = require('jsonwebtoken')
  , config  = require('../config')
  , fs      = require('fs')
  , log     = require('debug')('app');

var boundary = Math.random()

var imageName = __dirname + '/IMG_4300.JPG';
var sha1Image = "748fa97bd26133c7b0f514fb68f4ba394bad46b200a777cbdab90dd0a0b0799d";

var app = require('../app');

request(app)
  .post('/upload')
  .field('Content-Type', 'multipart/form-data')
  .attach('image', imageName)
  .set('x-access-token', jwt.sign({ authorized: true }, config.secretKey ))
  .set('x-custom-sha1', sha1Image)
  .expect(200)
  .end(function (err, res) {
      var form = res.body;
      console.log(form);
      
      if (err) {
        console.log(err);
      }
  });