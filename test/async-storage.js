'use strict'

function AsyncStorage(){
	this.data = {};
}

AsyncStorage.prototype.setItem = function(id, val) {
  this.data[id] = this.data[id] || [];
	return new Promise((resolve, reject) => {
		this.data[id].push(val);
		resolve();
	});
}
AsyncStorage.prototype.getItem = function(id) {
  this.data[id] = this.data[id] || [];
	return new Promise((resolve, reject) => {
		resolve(this.data[id]);
	});
}
AsyncStorage.prototype.clear = function() {
  return new Promise((resolve, reject) => {
    this.data = {};
    resolve();
  });
}

module.exports = AsyncStorage;
