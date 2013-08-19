var EventEmitter = require('events').EventEmitter;
var util = require('util');
var logger = require('log-driver')({ level : 'info' });

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
    logger.debug("worker done.  repeat: ", queue.getLength(), queue.isEmpty());
    if (!queue.isEmpty()){
      logger.debug("queue not empty.  running worker again.");
      scheduler.emit('work');
      worker.run(queue, function(){
        logger.debug("did some jobs!");
      });
    } else {
      scheduler.makeIfReady();
    }
  });
  queue.on('added', function(){
    scheduler.emit('work');
    worker.run(queue, function(){
      logger.debug("did some jobs!");
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
      logger.debug("queue not empty");
      return;
    }
    if (this.worker.running){
      logger.debug("worker running");
      return;
    }
  }
  if (!this.timerReady){
    logger.debug("timer not ready");
    return;
  }
  if (this.maker.running){
    logger.debug("maker running");
    return;
  }

  if (!!this.makeInterval){
    // timer is always ready if there's no makeInterval.
    // if there is a makeInterval, reset the timer to "not ready"
    this.timerReady = false;
  }
  this.emit("make");
  this.maker.run(this.queue, function(){
    logger.debug("made some jobs!");
  });
};

module.exports = BatchScheduler;
