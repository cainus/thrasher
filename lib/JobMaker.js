var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var util = require('util');

var JobMaker = function(strategy){
  // strategy is a function that makes jobs.
  // It takes a call-back, and that callback takes
  // an array of jobs.
  this.strategy = strategy;
  this.running = false;
};
util.inherits(JobMaker, EventEmitter);

JobMaker.prototype.runSynch = function(queue, done){
  if (this.running){
    this.emit('done', "already running");
    if (done){
      done("already running");
    }
  } else {
    this.run(queue, done);
  }
};

JobMaker.prototype.run = function(queue, done) {
  var maker = this;
  this.running = true;
  this.strategy(function(items){
    maker.running = false;
    queue.add(items);
    maker.emit('done');
    if (done){ 
      return done();
    }
  });
};

module.exports = JobMaker;
