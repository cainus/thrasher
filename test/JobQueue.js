var should = require('should');
var JobQueue = require('../index').JobQueue;

describe("JobQueue", function(){

  describe("ctor", function(){
    it("should instanitate a new JobQueue", function(){
      var jobQueue = new JobQueue();
      should.exist(jobQueue);
    });
  });
    
  describe("add", function(){
    it("accepts a single job and adds it to the queue", function(done){
        var jobQueue = new JobQueue();
        jobQueue.on("added", function(){
            done();
        });
        jobQueue.add("payload");
    });
    
    it("accepts an array of jobs and adds it to the queue", function(done){
        var jobQueue = new JobQueue();
        jobQueue.on("added", function(){
            done();
        });
        jobQueue.add(["payload1", "payload2"]);
    });
  });

  describe("remove", function(){
    it("should dequeue a single job", function(){
      var jobQueue = new JobQueue();
      jobQueue.add("payload");
      var jobs = jobQueue.remove();
      jobs[0].payload.should.equal("payload");
    });
    
    it("should dequeue multiple jobs", function(){
      var jobQueue = new JobQueue();
      jobQueue.add(["payload1", "payload2"]);
      var jobs = jobQueue.remove();
      jobs[0].payload.should.equal("payload1");
      jobs[1].payload.should.equal("payload2");
    });

    it("emits empty if the queue is empty", function(done){
        var jobQueue = new JobQueue();
        jobQueue.on("empty", function(){
          done();
        });
        jobQueue.remove(1);
    });

  });

  describe("getLength", function(){
    it("should return the length of the queue", function(){
      var jobQueue = new JobQueue();
      jobQueue.add(["payload1", "payload2"]);
      jobQueue.getLength().should.equal(2);
    });
  });

  describe("isEmpty", function(){
    it("should return false is jobs exist in the queue", function(){
      var jobQueue = new JobQueue();
      jobQueue.add("payload");
      jobQueue.isEmpty().should.equal(false);
    });
    
    it("should return true if the job queue is empty", function(){
      var jobQueue = new JobQueue();
      jobQueue.isEmpty().should.equal(true);
    });


  });

});
