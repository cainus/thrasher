var should = require('should');
var BatchScheduler = require('../index').BatchScheduler;
var JobMaker = require('../index').JobMaker;
var Worker = require('../index').Worker;
var JobQueue = require('../index').JobQueue;

describe("BatchScheduler", function(){
  it ("does some stuff", function(done){
      // TODO finish this test!!
    var maker = new JobMaker(function(cb){
      cb([1,2,3,4]);
    });
    var queue = new JobQueue();
    var worker = new Worker(function(job){
      console.log("doing");
      done();
    }, false, 200);
    var asynch = false;
    var scheduler = new BatchScheduler(maker, worker, queue, asynch);
    scheduler.start(1000, 500);
    scheduler.stop();
  });

});
