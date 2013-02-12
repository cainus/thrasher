var Worker = require('./Worker');
var JobMaker = require('./JobMaker');
var JobQueue = require('./JobQueue');
var BatchScheduler = require('./BatchScheduler');

// TODO: synchronousBatches = true.  False allows maker to
// keep dumping in the queue, even if it's not empty.

// TODO: workInterval.  Allows you to decide how long
// to wait between jobs.

// TODO: allow intervals to change while in progress
// (useful for exponential back-off)

// TODO: process management
// TODO: logging
// TODO: web UI
// multiple thrashers in one app, via childProcess?




var BatchThrasher = function(options){
  this.retryInterval = options.retryInterval;
  this.makeInterval = options.makeInterval;
  this.jobInterval = options.jobInterval;
  this.jobQ = new JobQueue();
  var jobQ = this.jobQ;
  this.maker = new JobMaker(options.makeJobs);
  this.worker = new Worker(options.onJob,
                           options.asynchWorker,
                           options.jobInterval);
  this.scheduler = new BatchScheduler(this.maker, 
                                      this.worker, 
                                      this.jobQ);
  this.worker.on('done', function(){
    if (jobQ.isEmpty()){
      options.afterBatch();
    }
  });

};

BatchThrasher.prototype.start = function(){
  this.scheduler.start(this.makeInterval,
                       this.retryInterval);
};

module.exports = BatchThrasher;
