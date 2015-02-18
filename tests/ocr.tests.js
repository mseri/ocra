var ocr = require('../lib/ocr');

var inputFile = __dirname + '/IMG_4300.JPG';
ocr.process(inputFile, function(err, data) {
  if (err) {
    throw err;
  }
  if (data !== "120.60") {
    throw "Regex not functioning properly";
  }
  console.log("Test Succesful: " + data);
});
