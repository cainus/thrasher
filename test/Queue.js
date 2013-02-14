var should = require('should');
var Queue = require('../index').Queue;

describe("Queue", function(){
  describe("ctor", function(){
    it("should accept an array of items and enqueue them", function(){
      var items = [1, 2, 3];
      var queue = new Queue(items);
      queue.dequeue(3).should.eql(items);        
    });

    it("should accept no arguments", function(){
        var queue = new Queue();
        should.exist(queue);
        
    });

    it("accepts and enqueues a non-array argument", function(){
        var queue = new Queue(13);
        should.exist(queue);
        queue.dequeue(1).should.eql(13);
    });

  });

  it("should enqueue individual items and dequeue them in FIFO order", function(){
    var queue = new Queue();
    queue.enqueue(1);
    queue.enqueue(100);
    queue.dequeue(1).should.equal(1);
    queue.dequeue(1).should.equal(100);
  });

  it("should enqueue an array and dequeue items in FIFO order", function(){
    var queue = new Queue();
    queue.enqueue([1, 100]);
    queue.dequeue(1).should.equal(1);
    queue.dequeue(1).should.equal(100);
  });

  it("should enqueue an array and dequeue Infinity items in FIFO order", function(){
    var queue = new Queue();
    queue.enqueue([1, 100, 300]);
    queue.dequeue(Infinity).should.eql([1,100,300]);
  });

  it("should dequeue all items if dequeue is called with no args", function(){
    var queue = new Queue();
    queue.enqueue([1,2,3]);
    queue.dequeue().length.should.equal(3);
  });

  it("should give the length of enqueued items", function(){
    var queue = new Queue([1,2,3]);
    queue.getLength().should.equal(3);
  });
  
  describe("isEmpty", function(){
    it("should return false if the queue has items", function(){
      var queue = new Queue([1,2,3]);
      queue.isEmpty().should.equal(false);
    });
    
    it("should return true if the queue is empty", function(){
      var queue = new Queue();
      queue.isEmpty().should.equal(true);
    });

  });



});

