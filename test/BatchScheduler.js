var should = require('should');
var BatchScheduler = require('../index').BatchScheduler;
var JobMaker = require('../index').JobMaker;
var Worker = require('../index').Worker;
var JobQueue = require('../index').JobQueue;

describe("BatchScheduler", function(){
  beforeEach(function(){
    this.simpleMaker = new JobMaker(function(cb){
      process.nextTick(function(){
        cb([1,2,3,4]);
      });
    });
    this.badMaker = new JobMaker(function(cb){
      should.fail("maker should not make");
    });
    this.nullWorker = new Worker(function(job, cb){
      // do nothing
      cb([]);
    }, false, 10);
    this.badWorker = new Worker(function(job, cb){
      should.fail("worker should not execute job");
    }, false, 10);
    this.queue = new JobQueue();
  });
  it ("can perform jobs synchronously", function(done){
    var test = { };
    var pendingJobs = 4;
    var worker = new Worker(function(job, cb){
      pendingJobs--;
      if (pendingJobs === 0){
        test.scheduler.stop();
        done();
      }
      cb();
    }, false, 10);
    var asynch = false;
    test.scheduler = new BatchScheduler(this.simpleMaker, worker, this.queue, asynch);
    test.scheduler.start(1000, 100);
  });
  it ("can perform jobs asynchronously", function(done){
    var test = { };
    var pendingJobs = 4;
    var worker = new Worker(function(job, cb){
      pendingJobs--;
      if (pendingJobs === 0){
        test.scheduler.stop();
        done();
      }
      cb();
    }, false, 10);
    var asynch = true;
    test.scheduler = new BatchScheduler(this.simpleMaker, worker, this.queue, asynch);
    test.scheduler.start(100, 100);
    test.scheduler.makeInterval.should.equal(100);
  });
  it ("makes jobs immediately", function(){
    var pendingJobs = 4;
    var asynch = true;
    var scheduler = new BatchScheduler(this.simpleMaker, this.nullWorker, this.queue, asynch);
    var makeInterval = 100;
    scheduler.start(makeInterval, 100);
  });
  it ("will not try to 'make' again when a worker finishes unless the queue is empty", function(done){
    var test = { };
    var calls = 0;
    var maker = new JobMaker(function(cb){
      calls++;
      if (calls > 1){
        should.fail("this should not get called again.");
      }
      return cb([]);
    });
    var asynch = false;
    var scheduler = new BatchScheduler(maker, this.nullWorker, this.queue, asynch);
    this.queue.add(1);
    this.nullWorker.emit('done');
    done();
  });
  it ("can make jobs on a timer", function(done){
    var test = { };
    var calls = 0;
    var maker = new JobMaker(function(cb){
      calls++;
      if (calls >= 3){
        test.scheduler.stop();
        done();
      }
      return cb([]);
    });
    var asynch = true;
    test.scheduler = new BatchScheduler(maker, this.nullWorker, this.queue, asynch);
    var makeInterval = 100;
    test.scheduler.start(makeInterval, 100);
  });
  describe("makeIfReady", function(){
    it ("should not 'make' if it's already 'making'", function(){
      // workers are still working on the queue, so don't add more!
      var asynch = false;
      this.badMaker.running = true;
      var scheduler = new BatchScheduler(this.badMaker, this.badWorker, this.queue, asynch);
      scheduler.makeIfReady();
    });
    describe("in synchronousBatch mode", function(){
      it ("should not 'make' if the worker is running", function(){
        // workers are still working on the queue, so don't add more!
        var asynch = false;
        this.badWorker.running = true;
        var scheduler = new BatchScheduler(this.badMaker, this.badWorker, this.queue, asynch);
        scheduler.makeIfReady();
      });
      it ("should not 'make' if the queue has items", function(){
        // workers are still working on the queue, so don't add more!
        var asynch = false;
        this.queue.add(1);
        var scheduler = new BatchScheduler(this.badMaker, this.badWorker, this.queue, asynch);
        scheduler.makeIfReady();
      });
    });
  });

});
