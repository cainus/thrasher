var EventEmitter = require('events').EventEmitter;
var util = require('util');


var BatchScheduler = function(maker, worker, queue){
  this.timerReady = true;
  this.interval = null;
  this.worker = worker;
  this.maker = maker;
  this.queue = queue;
  this.intervalObject = null;
};
util.inherits(BatchScheduler, EventEmitter);

BatchScheduler.prototype.stop = function(){
  clearInterval(this.intervalObject);
};


BatchScheduler.prototype.start = function(interval, retryInterval){
  var scheduler = this;
  var worker = this.worker;
  var queue = this.queue;
  this.interval = interval;
  this.retryInterval = retryInterval;
  worker.on('done', function(){
    console.log("worker done.  repeat");
    if (!queue.isEmpty()){
      worker.run(queue, function(){
        console.log("did some jobs!");
      });
    } else {
      scheduler.makeIfReady();
    }
  });
  queue.on('added', function(){
    worker.run(queue, function(){
      console.log("did some jobs!");
    });
  });
  if (!!this.interval){
    this.intervalObject = setInterval(function(){
      scheduler.timerReady = true;
      scheduler.makeIfReady();
    }, this.interval);
  }

  this.makeIfReady();
};

BatchScheduler.prototype.makeIfReady = function(){
  if (!this.queue.isEmpty()){
    console.log("queue not empty");
    return;
  }
  if (this.worker.running){
    console.log("worker running");
    return;
  }
  if (!this.timerReady){
    console.log("timer not ready");
    return;
  }
  if (this.maker.running){
    console.log("maker running");
    return;
  }

  if (!!this.interval){
    // timer is always ready if there's no interval.
    // if there is an interval, reset the timer to "not ready"
    this.timerReady = false;
  }
  this.maker.run(this.queue, function(){
    console.log("made some jobs!");
  });
};

module.exports = BatchScheduler;
