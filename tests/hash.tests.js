var hash = require('../lib/hash');

var inputFile = __dirname + '/IMG_4300.JPG';

//TODO: fix hashFunction.name

function hashTest(fileName, hashFunction){
  hashFunction(fileName, function(err, data) {
    console.log("Testing " + hashFunction.name)
    if (err) {
      throw err;
    } 

    if (data != "748fa97bd26133c7b0f514fb68f4ba394bad46b200a777cbdab90dd0a0b0799d") {
      throw hashFunction.name + " sha256 hex digest is wrong.";
    }

    console.log(hashFunction.name + " sha256 hex digest for " + fileName +" is: " + data);
  });
}

hashTest(inputFile, hash.hashFile);