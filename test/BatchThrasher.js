var should = require('should');
var BatchThrasher = require('../index').BatchThrasher;

describe("BatchThrasher", function(){
  it ("calls the afterBatch handler when complete", function(done){
    var makeJobsCalled = false;
    var onJobCalls = 0;
    var thrasher = new BatchThrasher({
        makeJobs : function(cb){
          makeJobsCalled = true;
          cb([1,2,3]);
        },
        onJob : function(job, done){
          onJobCalls++;
          done();
        },
        afterBatch : function(){
          console.log("afterbatch");
          done();
        },
        retryInterval : 500,
        makeInterval : 2000,
        jobInterval : 1,
        asynchronousBatches : false
    });
    thrasher.start();

  });
});

