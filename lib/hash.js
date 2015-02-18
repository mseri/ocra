'use strict';

module.exports = {
  // Shasum using sha256 computed using node's crypto library
  hashFile : function(fileName, cb) {
    var crypto = require('crypto'),
      fs = require('fs'),
      hash = crypto.createHash('sha256'), 
      stream = fs.createReadStream(fileName),
      err = null;

    stream.on('error', function(err) {
      cb(err);
    });

    stream.on('data', function (data) {
        hash.update(data, 'utf8');
    });

    stream.on('end', function () {
      cb(err, hash.digest('hex').toString());
    });
  },
  
  generateUUID : function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
};
