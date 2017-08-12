const expect = require('expect.js');
const LoggerageObject = require('../build/loggerage-object').LoggerageObject;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;

describe("LoggerageObject", function() {

  it('constructor without app and level', function(){
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '1 info log');

    expect(obj.app).not.be.ok();
    expect(obj.version).not.be.ok();

  });

  it('constructor with app', function(){
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '1 info log', 'APP_NAME');

    expect(obj.app).be.equal('APP_NAME');
    expect(obj.version).not.be.ok();
  });

  it('constructor with app and version', function(){
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '1 info log', 'APP_NAME', 1);

    expect(obj.app).be.equal('APP_NAME');
    expect(obj.version).be.equal(1);
  });

  it('constructor message is equal', function(){
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '1 info log', 'APP_NAME', 1);

    expect(obj.message).be.equal('1 info log');
  });

  it('constructor, level_number is filled', function(){
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '1 debug log', 'APP_NAME', 1);

    expect(obj.level).be.equal(LoggerageLevel[LoggerageLevel.DEBUG]);
    expect(obj.level_number).be.equal(LoggerageLevel.DEBUG);
  });

  it('constructor, timestamp is ok', function(){
    var now = Date.now();
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '1 debug log');

    expect(obj.timestamp).be.equal(now);
  });

  it('constructor, date is ok', function(){
    var now = new Date();
    var obj = new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '1 debug log');

    expect(obj.date).be.equal(now.toLocaleString());
  });

});
