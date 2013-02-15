
var Job = function(payload, queue){
  if (!payload){
    throw "Job requires a non-null payload.";
  }
  this.payload = payload;
  this.queue = queue;
  this.created = new Date();
  this.attemptTimes = [];
  this.errors = [];
};

Job.prototype.retry = function(err){
  this.attemptTimes.push(new Date());
  if (err){
    this.errors.push(err);
  }
  // put it back on the jobQueue's internal queue
  // instead of re-adding it normally so that
  // it won't get wrapped in another 'job' object
  this.queue.q.enqueue(this);
};

Job.prototype.attempts = function(){
  return this.attemptTimes.length;
};

module.exports = Job;
