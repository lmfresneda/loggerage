'use strict'

function AsyncStorage(){
	this.data = {};
}

AsyncStorage.prototype.setItem = function(id, val) {
	return new Promise((resolve, reject) => {
		this.data[id] = String(val);
		resolve();
	});
}
AsyncStorage.prototype.getItem = function(id) {
	return new Promise((resolve, reject) => {
		resolve(this.data[id]);
	});
}

module.exports = AsyncStorage;