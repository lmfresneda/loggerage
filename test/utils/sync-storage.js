'use strict'

function SyncStorage(){
  this.data = {};
}

SyncStorage.prototype.setItem = function(id, val) {
  this.data[id] = this.data[id] || [];
  this.data[id].push(val);
}
SyncStorage.prototype.getItem = function(id) {
  this.data[id] = this.data[id] || [];
  return this.data[id];
}
SyncStorage.prototype.clear = function() {
  this.data = {};
}

module.exports = SyncStorage;
