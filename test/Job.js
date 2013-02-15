var should = require('should');
var JobQueue = require('../index').JobQueue;
var Job = require('../index').Job;

describe("Job", function(){

  describe("ctor", function(){
    it("throws an exception if the payload is null", function(){
      try {
        var job = new Job(null);
        should.fail("expected exception was not thrown.");
      } catch (ex){
        ex.should.equal("Job requires a non-null payload.");
      }
    });
    it("should initialize with a payload and a job queue", function(){
      var jobQueue = new JobQueue();
      var job = new Job("payload", jobQueue);
      job.payload.should.equal("payload");
      job.queue.should.equal(jobQueue);
      should.exist(job.created.getTime);
      job.attemptTimes.should.eql([]);
      job.errors.should.eql([]);
    });
  });
  describe("retry", function(){
    it ("should re-enqueue the job", function(){
      var jobQueue = new JobQueue();
      var job = new Job("payload", jobQueue);
      job.retry("some error");
      jobQueue.getLength().should.equal(1);
      job.attemptTimes.length.should.equal(1);
      job.errors.should.eql(["some error"]);
      job.attempts().should.equal(1);
    });
  });

});
