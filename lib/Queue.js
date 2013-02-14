var _ = require('underscore');

var Queue = function(items){
 
  if (_.isArray(items) || (items === undefined)) {
    this._internal = items || [];
  } else {
    this._internal = [];
    this._internal.push(items);
  }
};

Queue.prototype.enqueue = function(items){
  if (_.isArray(items)){
    this._internal = this._internal.concat(items);
  } else {
    this._internal.push(items);
  }
};

Queue.prototype.dequeue = function(count){
  count = count || Infinity;
  var items;
  switch(count){
    case (1):
      return this._internal.shift();
    case (Infinity):
      items = this._internal.slice(0);
      this._internal = [];
      return items;
    default:
      items = this._internal.slice(0, count);
      this._internal = this._internal.slice(count);
      return items;
  }
};

Queue.prototype.getLength = function(){
  return this._internal.length;
};

Queue.prototype.isEmpty = function(){
  return this._internal.length === 0;
};

module.exports = Queue;
