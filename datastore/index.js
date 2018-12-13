const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var readFileAsync = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    console.log('NEW #: ',id);
    var fileName = path.join(exports.dataDir, `${id}.txt`); //'id.txt'
    fs.writeFile(fileName, text, (err) => {
      if(err) {
        throw err;
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.readAll = (callback) => {
  var fileName = exports.dataDir;
  fs.readdir(fileName, (err, data) => {
    if(err) {
      throw err;
    } else {
      var readOneAsync = Promise.promisify(readOne);
      var promisifiedArr = _.map(data,(file)=>{
        var id = file.split('.txt')[0];
        return readOneAsync(id);
      });
      Promise.all(promisifiedArr)
        .then(dataList => {
          callback(null, dataList);
        })
        .catch(err => {
          callback(err);
        });
    }
  });
};

var readOne = (id, callback) => {
  //have filename from l12
  var fileName = path.join(exports.dataDir, id + '.txt'); //'id.txt'
  //use readflie class name
  fs.readFile(fileName, 'utf8', (err, data) => {
    if(err){
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, 'text': data });
    }
  });
};
exports.readOne = readOne;

exports.update = (id, text, callback) => {
  //read the file name
  var fileName = path.join(exports.dataDir, id + '.txt'); //'id.txt'
  //check if  it exists
  fs.readFile(fileName, 'utf8', (err, data) => {
    if(err){
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(fileName, text, (err) => {
        if(err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, 'text': text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  //convert the id to the var name in the dir
  // var fileName = path.join(exports.dataDir, id + '.txt'); //'id.txt'
  var fileName = path.join(exports.dataDir, `${id}.txt`); //'id.txt'
  fs.unlink(fileName, (err) => {
    if(err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, 'yay deleted!');
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
