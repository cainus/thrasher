var BatchThrasher = require('index').BatchThrasher;

var thrasher = new BatchThrasher({
  makeJobs : function(cb){
    cb([1,2,3,4]);
  },
  onJob : function(job, done){
    console.log("payload is: ", job.payload);
    console.log(job.attemptTimes);
    console.log(job.errors);
    if (job.payload === 2){
      console.log("gonna retry this one");
      job.payload--;
      job.retry("it was two.  two sucks.");
    }
    return done();
  },
  afterBatch : function(){
    console.log("batch processed successfully!");
  },
  makeInterval : 4000,
  retryInterval : 1000
});
thrasher.start();



