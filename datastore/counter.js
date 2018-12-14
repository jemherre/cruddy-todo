const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
var Promise = require('bluebird');
var readFileAsync = Promise.promisify(fs.readFile);
var writeFileAsync = Promise.promisify(fs.writeFile);
var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(err, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

// var readCounterAsync = function(){
//   var promise1 = new Promise( (reject,resolve) =>{
//     readFileAsync(exports.counterFile,'utf8')
//       .then((data)=>{
//         resolve(data);
//       })
//       .catch((err)=>{
//         reject(data);
//       });
//   });
//   return promise1;
// }

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// var writeCounterAsync = function(count) {
//   var promise1 = new Promise( (reject,resolve) => {
//     var counterString = zeroPaddedNumber(count);
//     writeFileAsync(exports.counterFile, counterString)
//       .then(() => {
//         resolve(counterString);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
//   return promise1;
// }

// Public API - Fix this function //////////////////////////////////////////////

var getNextUniqueId = (callback) => {
  readCounter( (err, newCount) => {
    if (err) {
      callback(err, null);
    } else {
      writeCounter( newCount+1, (err, padNums) => {
        if(err) {
          callback(err, null);
        } else {
          callback(null, padNums);
        }
      });
    }
  });
};

// var getNextUniqueIdAsync = function() {
//   return readCounterAsync()
//     .then((newCount) => {
//      return writeCounterAsync(newCount+1)
//         .then((padNums) => {
//           return padNums;
//         });
//     });
// }

// exports.getNextUniqueIdAsync = getNextUniqueIdAsync; 
// Configuration -- DO NOT MODIFY //////////////////////////////////////////////
exports.getNextUniqueId = getNextUniqueId; 
exports.counterFile = path.join(__dirname, 'counter.txt');
