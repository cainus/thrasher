var should = require('should');
var JobMaker = require('../index').JobMaker;
var JobQueue = require('../index').JobQueue;

describe("JobMaker", function(){
  it ("can execute a strategy that calls back with a list.", function(done){
    var maker = new JobMaker(function(cb){
      cb([1,2,3,4]);
    });

    var queue = new JobQueue();

    maker.run(queue, function(cb){
      queue.getLength().should.equal(4);
      done();
    });

  });
  it ("emits a done event when done", function(done){
    var maker = new JobMaker(function(cb){
      cb([1,2,3,4]);
    });

    var queue = new JobQueue();

    maker.on('done', function(){
      done();
    });

    maker.run(queue);

  });
  describe("#runSynch", function(){
    it ("if not already running, does the same thing as run().", function(done){
      var maker = new JobMaker(function(cb){
        cb([1,2,3,4]);
      });

      var queue = new JobQueue();

      maker.runSynch(queue, function(cb){
        queue.getLength().should.equal(4);
        done();
      });

    });
    it ("doesn't allow subsequent runs if the maker is already running", function(done){
      var maker = new JobMaker(function(cb){
        should.fail("should never get here");
        cb([1,2,3,4]);
      });

      var queue = new JobQueue();

      maker.running = true;

      maker.runSynch(queue, function(err){
        err.should.equal("already running");
        done();
      
      });

    });
    it ("emits a done event with error message if maker is already running", function(done){
      var maker = new JobMaker(function(cb){
        should.fail("should never get here");
        cb([1,2,3,4]);
      });

      var queue = new JobQueue();

      maker.running = true;

      maker.on('done', function(data){
        data.should.equal("already running");
        done();
      });

      maker.runSynch(queue);

    });
  });
});
