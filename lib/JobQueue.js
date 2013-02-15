var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Queue = require('./Queue');
var Job = require('./Job');
var _ = require('underscore');

var JobQueue = function(){
  this.q = new Queue();
};

util.inherits(JobQueue, EventEmitter);

JobQueue.prototype.add = function(payloads){
  if (!_.isArray(payloads)){
    payloads = [payloads];
  }
  var that = this;
  var jobs = _.map(payloads, function(payload){
    var job = new Job(payload, that);
    return job;
  });
  this.q.enqueue(jobs);
  this.emit('added');
};

JobQueue.prototype.remove = function(count){
  var jobs = this.q.dequeue(count);
  if (this.q.isEmpty() === true){
    this.emit('empty');
  }
  return jobs;
};

JobQueue.prototype.getLength = function(){
  return this.q.getLength();
};

JobQueue.prototype.isEmpty = function(){
  return this.q.isEmpty();
};


module.exports = JobQueue;
