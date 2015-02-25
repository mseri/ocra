'use strict';

var request = require('supertest')
  , express = require('express')
  , hash    = require('../lib/hash')
  , config  = require('../config')
  , fs      = require('fs');

var boundary = Math.random();

var imageName = __dirname + '/IMG_4300.JPG';
var sha1Image = "748fa97bd26133c7b0f514fb68f4ba394bad46b200a777cbdab90dd0a0b0799d";

var string_token = hash.generateUUID();
var access_token = hash.hashString(string_token + config.secretKey);

var app = require('../app');

// definitely not idiomatic or nice but it does the trick

request(app)
  .post('/upload')
  .field('Content-Type', 'multipart/form-data')
  .attach('image', imageName)
  .set('ocra-string-token', string_token)
  .set('ocra-access-token', access_token)
  .set('ocra-image-sha1', sha1Image)
  .expect(200)
  .end(function (err, res) {
      var form = res.body;
      if (form.sha1 == '748fa97bd26133c7b0f514fb68f4ba394bad46b200a777cbdab90dd0a0b0799d' && form.total=='120.60') {
        console.log("Image succesfully uploaded and processed.");
      }
      if (err) {
        console.log("Error: " + err);
      }
  });

request(app)
  .post('/upload')
  .end(function (err, res) {  
    if (res.status == 401) {
      console.log("Success. Unauthorised connection rejected.");
    } else {
      console.log("Error...");
    }
  });