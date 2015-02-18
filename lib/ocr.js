module.exports = {
  // In case of success returns a string representing a float
  // of the form "[0-9]+.[0-9]{2}". A parseFloat(output) will
  // give the corresponding float value.
  process : function(filePath, cb) {
    // Can we make it global for the module
    // or it has to be re-required each time?
    var tesseract = require('node-tesseract');

    var err = null;
    var options = {
      l: 'eng',
      psm: 1,
      // we may have to fix the following if on the server is different
      binary: 'tesseract' //'/usr/local/bin/tesseract'
    };

    tesseract.process(filePath, options, function(err, text) {
      if (err) {
          cb(err);
      } else {
          scrapeText(text, cb);
      }
    });
  }
};

function scrapeText(text, cb) {
    // If you are not familiar with RegExp you may want to paste it
    // on https://regex101.com/#javascript or read
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions 
    var re = /.*(total|amount)[^\d]*([0-9]+)[^\d]*([0-9]+)/ig;

    // scrapedData is an array that contains either null or
    // 0. the matched line
    // 1. the first matched group (for some reasons the result of (total|amount))
    // 2. the second matched group (integer part of the value)
    // 3. the third matched group (decimal part of the value)
    // 4. index of the first match
    // 5. input string
    var scrapedData = re.exec(text);

    if(scrapedData) {
      var scrapedText = scrapedData[2] + '.' + scrapedData[3];
      cb(null, scrapedText);
    } else {
      cb("Text Analysis Error: unable to extract any data.");
    }
  }
