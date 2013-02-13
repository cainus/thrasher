# ![Thrasher](https://raw.github.com/cainus/thrasher/master/thrasher.png)
[![Build Status](https://travis-ci.org/cainus/thrasher.png?branch=master)](https://travis-ci.org/cainus/thrasher)

An in-process non-persistent job queue that fetches its own work.

example:
```javascript
var BatchThrasher = require('thrasher').BatchThrasher;
var thrasher = new BatchThrasher({

  makeJobs : function(cb){
    var someJobs = [
      {id : 1, sometext: "foo"},
      {id : 2, sometext: "bar"},
      {id : 3, sometext: "baz"}    
    ]
    cb(someJobs);  // call-back with a list of jobs to process
  },


  onJob : function(job, done){
    console.log("got a job! ", job);
    done();  // call done() when each job is completed.
  },


  afterBatch : function(){
    console.log("batch processed successfully!");
  },

  makeInterval : 2 * 60 * 1000,  // the time between when it tries to make jobs (in ms)
  retryInterval : 2000,          // the time between retries on failed jobs (in ms)
  asynchWorker : false,          // whether the jobs can all be processed at the same time
  asynchronousBatches : true     // whether more jobs can be made before the last batch of jobs
                                 // has been processed.
});
```


