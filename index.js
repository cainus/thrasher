var dir = './lib/';
if (process.env.THRASHER_COVERAGE){
  console.log("coverage mode");
  dir = './lib-cov/';
}

exports.StatusServer = require(dir + 'StatusServer');
exports.BatchThrasher = require(dir + 'BatchThrasher');
exports.BatchScheduler = require(dir + 'BatchScheduler');
exports.JobMaker = require(dir + 'JobMaker');
exports.JobQueue = require(dir + 'JobQueue');
exports.Queue = require(dir + 'Queue');
exports.Worker = require(dir + 'Worker');
exports.Job = require(dir + 'Job');
