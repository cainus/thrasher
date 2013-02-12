var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var util = require('util');

var Worker = function(oneJobStrategy, asynchronous, jobInterval){
  // oneJobStrategy is a function that can be passed one job
  // and a done callback.
  // The strategy MUST call the done callback
  this.strategy = oneJobStrategy;
  this.running = false;
  this.synchronous = !asynchronous;
  this.batchSize = null;
  this.jobInterval = jobInterval || 1;

  // TODO:  jobTimeout!!
  this.jobTimeout = 2 * 60 * 1000; // 2 min default
};

util.inherits(Worker, EventEmitter);

Worker.prototype.performJob = function(job, done){
  this.strategy(job, done);
};

Worker.prototype.runSynch = function(queue, done){
  if (this.running){
    done("already running.");
  } else {
    this.run(queue, done);
  }
};

Worker.prototype.run = function(queue, done){
  this.running = true;
  var worker = this;
  var jobs = queue.remove(this.batchSize);
  if (this.synchronous){
    runJobsSynch(this, jobs, function(){
      worker.running = false;
      worker.emit('done');
      if (done){ done(); }
    });
  } else {
    runJobs(this, jobs, function(){
      worker.running = false;
      worker.emit('done');
      if (done){ done(); }
    });
  }
};

module.exports = Worker;

// run jobs one at a time
function runJobsSynch(worker, jobs, done){
  if (jobs.length > 0){
    var job = jobs.shift();
    worker.performJob(job, function(){
      setTimeout(function(){
        runJobsSynch(worker, jobs, done);
      }, worker.jobInterval);
    });
  } else {
    done();
  }
}

// run all jobs at once
function runJobs(worker, jobs, done){
  var remaining = jobs.length;
  _.each(jobs, function(job){
    worker.performJob(job, function(){
      remaining--;
      if (remaining === 0){
        done();
      }
    });
  });
}
