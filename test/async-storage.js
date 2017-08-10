'use strict'

function AsyncStorage(){
	this.data = {};
}

AsyncStorage.prototype.setItem = function(id, val) {
  this.data[id] = this.data[id] || [];
	return new Promise((resolve, reject) => {
    try{
  		this.data[id].push(val);
  		resolve();
    }catch(err){
      reject(err);
    }
	});
}
AsyncStorage.prototype.getItem = function(id) {
  this.data[id] = this.data[id] || [];
	return new Promise((resolve, reject) => {
    try{
		  resolve(this.data[id]);
    }catch(err){
      reject(err);
    }
	});
}
AsyncStorage.prototype.clear = function() {
  return new Promise((resolve, reject) => {
    try{
      this.data = {};
      resolve();
    }catch(err){
      reject(err);
    }
  });
}

module.exports = AsyncStorage;
