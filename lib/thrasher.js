var _ = require('underscore');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var cronJob = require('cron').CronJob;
var util = require('util');

// TODO: what if one batch is not done before the schedule calls for another?
// TODO: thrash() currently gets all urls at once.  this might be dumb.

// urlListSchedule format: https://github.com/ncb000gt/node-cron
Thrasher = function(options){
  //{ urlListStrategy : function(cb){},
  //  urlStrategy : function(cb){},
  //  urlListSchedule : '* * * * * *' }
  //  }
  if (!options){
    throw "missing options parameter.";
  }
  if (!options.urlListStrategy){
   throw "missing option: " + urlListStrategy;
  }
  if (!_.isFunction(options.urlListStrategy)){
   throw "urlListStrategy option must be a function.";
  }

  this.urlListStrategy = options.urlListStrategy;

  var defaultUrlStrategy = function(url, cb){
    request(url, function(error, response, body){
      cb(error, response);
    });
  };
  this.urlStrategy = options.urlStrategy || defaultUrlStrategy;

  if (!options.urlListSchedule){
   throw "missing option: " + urlListSchedule;
  }
  this.urlListSchedule = options.urlListSchedule;
  this.thrashing = false;

  new cronJob(this.urlListSchedule);  // this just tests the cron syntax
};

util.inherits(Thrasher, EventEmitter);


var _thrash = function(thrasher){
  thrasher.thrash(function(err){
    thrasher.thrashing = false;
    if (err){
      thrasher.emit('thrashError', err);
    } else {
      thrasher.emit('thrashDone', err);
    }
  });
};


Thrasher.prototype.start = function(fetchNow){
  var thrasher = this;
  this.fetchNow = !!fetchNow;
  this.job = new cronJob(this.urlListSchedule, 
                         function(){
                           _thrash(thrasher);
                         },
                         function(){
                           // done
                         }
                        );
  if (this.fetchNow){
    _thrash(thrasher);
  }
  this.job.start();
};


Thrasher.prototype.getUrl = function(url){
  this._getUrl(url, function(error, response){
    if (error){
      thrasher.emit('urlError', {url : url, error : error});
    } else {
      thrasher.emit('urlSuccess', {
                                    url : url,
                                    response : response
                                   });
    }
  });
};

Thrasher.prototype.thrash = function(doneCB){
  console.log("thrash called");
  var thrasher = this;
  this.thrashing = true;
  this.urlListStrategy(function(err, urls){
    if (!_.isArray(urls)){
      return doneCB("urlListStrategy did not send an array of urls. " + JSON.stringify(urls));
    }
    var urlCount = urls.length;
    if (err){
      return doneCB(err);
    }
    _.each(urls, function(url){
      thrasher.urlStrategy(url, function(err, response){
        urlCount--;
        if (err){
          thrasher.emit('urlError', {url : url, error : err});
        } else {
          thrasher.emit('urlSuccess', {
                                        url : url,
                                        response : response
                                       });
        }
        if (urlCount === 0){
          return doneCB();
        }
       });
    });
  });
};


module.exports = Thrasher;
