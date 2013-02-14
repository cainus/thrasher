var dir = './lib/';
if (process.env.THRASHER_COVERAGE){
  console.log("coverage mode");
  dir = './lib-cov/';
}

exports.BatchThrasher = require(dir + 'BatchThrasher');
exports.BatchScheduler = require(dir + 'BatchScheduler');
exports.JobMaker = require(dir + 'JobMaker');
exports.JobQueue = require(dir + 'JobQueue');
exports.Queue = require(dir + 'Queue');
exports.Worker = require(dir + 'Worker');

