'use strict';

var express  = require('express')
    , router = express.Router()
    , multer = require('multer')
    , path   = require('path');

var log        = require('debug')('app')
    , logError = require('debug')('app:error');

var config = require('../config');

var ocr    = require('../lib/ocr')
    , auth = require('../lib/auth');

// how can I cange the location?
var location    = path.resolve(".") + "/tmp/"
    , imageName = null;

// check if sha1 fields is present
// if yes the middleware lets you through
// if no we abort returning a 401 error
function check_name(req, res, next) {
  imageName = req.headers['x-custom-sha1'];

  if (imageName != null) {
    next();
  } else {
    logError("req.headers['x-custom-sha1'] not present. Cannot proceed");
    res.end("req.headers['x-custom-sha1'] not present. Cannot proceed", 401);
  }
}

// setup multer middleware to write files in the /tmp
// folder. Rename them an log upload start and completion
var multer_mw = multer({ dest: location,
  rename: function (fieldname, filename) {
    return imageName;
  },
  onFileUploadStart: function (file) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return false;
    }
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadData: function (file, data) {
    console.log(data.length + ' of ' + file.fieldname + ' arrived')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  },
  onParseStart: function () {
    console.log('Form parsing started at: ', new Date())
  },
  onParseEnd: function (req, next) {
    console.log('Form parsing completed at: ', new Date());
    next(); //call the next middleware, if next() is not called then request will hang and no response will be returned
  },
  onFileSizeLimit: function (file) {
    console.log('Failed: ', file.originalname);
  },
  onFilesLimit: function () {
    console.log('Crossed file limit!')
  },
  onFieldsLimit: function () {
    console.log('Crossed fields limit!')
  },
  onPartsLimit: function () {
    console.log('Crossed parts limit!')
  },
  onError: function (error, next) {
    logError(error);
    next(error);
  }
});

// process the file and return the total
// or error 401 in case of error
function get_total(req, res, next) {
  ocr.process(location + imageName, function(err, total) {
    if (err) {
      log("Unable to get total from ", imageName);
      logError(err);
      res.end(err, 401);
    } else {
      log('OCR total:', total);
      var success = {
        sha1: imageName,
        total: total
      }; 
      log('Success: ', success);
      res.status(200);
      res.json(success);
    }
  });
}

// this is the route handler. First check auth. If so, 
// check if sha1 for the name is present, 
// proceed to multer middleware to download file
// lastly, use the file as you need
router.post('/upload', [auth.is_authorised, check_name, multer_mw, get_total]);

// this should be moved somewhere else or removed alltogether
if (config.env == 'development') {
    router.get('/status', function (req, res) {
        res.status(200);
        res.json({
          env : config.env
        });
    });
}

module.exports = router;