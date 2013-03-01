var http = require('http');
var util = require('util');
var _ = require('underscore');

var started = new Date();
var lastMakeDate = null;
var lastWorkDate = null;
var completed = [];
var made = [];

var StatusServer = function(thrasher){
  this.thrasher = thrasher;
  
  var jobCount = 0;
  thrasher.jobQ.on('added', function(){
    jobCount = thrasher.jobQ.getLength();
    console.log("jobCount is now: ", jobCount);
  });
  thrasher.scheduler.on('make', function(){
    lastMakeDate = new Date();
    made.push(new Date());
  });
  thrasher.scheduler.on('work', function(){
    lastWorkDate = new Date();
  });
  thrasher.worker.on('done', function(){
    completed.push(new Date());
  });


  this.server = http.createServer(function(req, res){
    var uptime = process.uptime();
    var now = new Date();
    var tenMinutes = 1000 * 60 * 10;
    completed = _.filter(completed, function(dt){
      return (now - dt) <= tenMinutes;
    });
    made = _.filter(made, function(dt){
      return (now - dt) <= tenMinutes;
    });

    var obj = {
      options : {
                  retryInterval : thrasher.retryInterval,
                  makeInterval : thrasher.makeInterval,
                  jobInterval : thrasher.jobInterval,
                  asynchronousBatches : thrasher.asynchronousBatches
      },
      events : {},
      batchesMadeInTheLast10Minutes : made.length,
      jobsFinishedInTheLast10Minutes : completed.length,
      jobsFinishedPerSecond : completed.length / Math.min(uptime, (now - started) / 1000),
      batchesMadePerSecond : made.length / Math.min(uptime, (now - started) / 1000),
      uptime : util.format('%dm:%ds', Math.floor(uptime / 60), Math.floor(uptime % 60)),
      now : now

    };
    if (lastMakeDate){
      obj.events.lastMake = lastMakeDate;
      obj.events.secondsSinceLastMake = (now - lastMakeDate) / 1000;
    }
    if (lastWorkDate){
      obj.events.lastWork = lastWorkDate;
      obj.events.secondsSinceLastWork = (now - lastWorkDate) / 1000;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  });
};

StatusServer.prototype.listen = function(port, cb) {
  this.server.listen(port, cb);
};

module.exports = StatusServer;
