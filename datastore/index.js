const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileName = path.join(exports.dataDir, id + '.txt'); //'id.txt'
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
  //need path name
  var fileName = exports.dataDir;
  //need to read directory for list of files >> return array
  fs.readdir(fileName, (err, data) => {
    if(err) {
      throw err;
    } else {
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
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
  //if error then the file does not exist
  //else invoke callback to display the data
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
