var should = require('should');
var JobQueue = require('../index').JobQueue;
var Job = require('../index').Job;

describe("Job", function(){

  describe("ctor", function(){
    it("should initialize with a payload and a job queue", function(){
      var jobQueue = new JobQueue();
      var job = new Job("payload", jobQueue);
      should.exist(jobQueue);
    });
  });

});
