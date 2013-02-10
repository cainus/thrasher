var framework = require('./index');
var Thrasher  = framework.Thrasher;
var jsdom     = require('jsdom');
var request   = require('request');
var fs   = require('fs');

var redditThrasher = new Thrasher({
  urlListStrategy : function(cb){
    console.log("running strategy");
    var urls;
    var manifest = 'http://www.reddit.com/r/pics';
    //example link <a class="title" href="http://i.imgur.com/Abu7kaD.jpg">
    jsdom.env(
      manifest,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        if (errors){
          return cb(errors);
        }
        var links = window.$("a.title");
        var newLinks = [];
        links.each(function(idx, el){
          newLinks.push(window.$(el).attr('href'));
        });
        return cb(null, newLinks);
      }
    );
  },
  urlListSchedule : '* * * * * 1'
});

redditThrasher.on('urlSuccess', function(data){
  console.log("got: ", data.url);
  var fname = process.cwd() + '/pics/' + (data.url.split("/")).pop();
  fs.writeFile(fname, data.response.body, function (err) {
    if (err){ 
      throw err;
    }
    console.log('saved ', data.url, ' as ', fname);
  });
});
redditThrasher.on('urlError', function(data){
  console.log("there was an error at ", data.url, ': ', JSON.stringify(data.error));
});
redditThrasher.start(true);
