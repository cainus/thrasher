var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Queue = require('./Queue');
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
  if (this.q.isEmpty() === 0){
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

// ======= job definition ==================
var Job = function(payload, queue){
  if (!payload){
    throw "Job requires a non-null payload.";
  }
  this.payload = payload;
  this.queue = queue;
  this.created = new Date();
  this.attemptTimes = [];
  this.errors = [];
};

Job.prototype.retry = function(err){
  this.attemptTimes.push(new Date());
  if (err){
    this.errors.push(err);
  }
  // put it back on the jobQueue's internal queue
  // instead of re-adding it normally so that
  // it won't get wrapped in another 'job' object
  this.queue.q.enqueue(this);
};

Job.prototype.attempts = function(){
  return this.attemptTimes.length;
};


module.exports = JobQueue;
