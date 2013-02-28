var EventEmitter = require('events').EventEmitter;
var util = require('util');


var BatchScheduler = function(maker, worker, queue, asynchronousBatches){
  this.timerReady = true;
  this.makeInterval = null;
  this.worker = worker;
  this.maker = maker;
  this.queue = queue;
  this.makeIntervalObject = null;
  this.synchronousBatches = !asynchronousBatches;
};
util.inherits(BatchScheduler, EventEmitter);

BatchScheduler.prototype.stop = function(){
  clearInterval(this.makeIntervalObject);
};

BatchScheduler.prototype.start = function(makeInterval){
  var scheduler = this;
  var worker = this.worker;
  var queue = this.queue;
  this.makeInterval = makeInterval;
  worker.on('done', function(){
    console.log("worker done.  repeat: ", queue.getLength(), queue.isEmpty());
    if (!queue.isEmpty()){
      console.log("queue not empty.  running worker again.");
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
  if (!!this.makeInterval){
    this.makeIntervalObject = setInterval(function(){
      scheduler.timerReady = true;
      scheduler.makeIfReady();
    }, this.makeInterval);
  }

  this.makeIfReady();
};

BatchScheduler.prototype.makeIfReady = function(){
  if (this.synchronousBatches){
    if (!this.queue.isEmpty()){
      console.log("queue not empty");
      return;
    }
    if (this.worker.running){
      console.log("worker running");
      return;
    }
  }
  if (!this.timerReady){
    console.log("timer not ready");
    return;
  }
  if (this.maker.running){
    console.log("maker running");
    return;
  }

  if (!!this.makeInterval){
    // timer is always ready if there's no makeInterval.
    // if there is a makeInterval, reset the timer to "not ready"
    this.timerReady = false;
  }
  this.maker.run(this.queue, function(){
    console.log("made some jobs!");
  });
};

module.exports = BatchScheduler;
