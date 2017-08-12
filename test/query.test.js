const expect = require('expect.js');
const moment = require('moment');
const Utils = require("../build/utils/utils").Utils;
const LoggerageObject = require('../build/loggerage-object').LoggerageObject;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;
const Query = require("../build/utils/query").Query;
const Queriable = require("../build/utils/query").Queriable;

describe("Queriable", function() {

  it('w/o request isQueryRequested == false', function(){
    var queriable = new Queriable();

    expect(queriable.isQueryRequested).not.be.ok();
  });

  it('with request but reset after isQueryRequested == false', function(){
    var queriable = new Queriable();

    queriable.app('APP');

    expect(queriable.isQueryRequested).be.ok();

    queriable.resetQuery();

    expect(queriable.isQueryRequested).not.be.ok();
  });

  it('with app isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.app('APP');

    expect(queriable.isQueryRequested).be.ok();
  });

  it('with from isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.from(new Date);

    expect(queriable.isQueryRequested).be.ok();
  });

  it('with to isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.to(new Date);

    expect(queriable.isQueryRequested).be.ok();
  });

  it('with level isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.level(LoggerageLevel.INFO);

    expect(queriable.isQueryRequested).be.ok();
  });

  it('with app isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.app('APP');

    expect(queriable.isQueryRequested).be.ok();
  });

  it('with version isQueryRequested == true', function(){
    var queriable = new Queriable();

    queriable.version(1);

    expect(queriable.isQueryRequested).be.ok();
  });

  it('from/to request with moment', function(){
    var queriable = new Queriable();
    const _from = moment().subtract(3, 'seconds');
    const _to = moment().subtract(1, 'seconds');

    queriable.from(_from).to(_to);

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('from', 'to');
    expect(query).to.eql({ from: _from.valueOf(), to: _to.valueOf() });
  });

  it('from/to request with Date', function(){
    var queriable = new Queriable();
    const _fromTS = moment().subtract(3, 'seconds').valueOf();
    const _toTS = moment().subtract(1, 'seconds').valueOf();
    const _from = new Date(_fromTS);
    const _to = new Date(_toTS);

    queriable.from(_from).to(_to);

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('from', 'to');
    expect(query).to.eql({ from: _from.getTime(), to: _to.getTime() });
  });

  it('from/to request with String w/o string format', function(){
    var queriable = new Queriable();
    const _fromTS = moment().subtract(3, 'seconds').valueOf();
    const _toTS = moment().subtract(1, 'seconds').valueOf();
    const _from = moment(_fromTS).format('YYYY-MM-DD HH:mm:ss.SSS');
    const _to = moment(_toTS).format('YYYY-MM-DD HH:mm:ss.SSS');

    queriable.from(_from).to(_to);

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('from', 'to');
    expect(query).to.eql({ from: _fromTS, to: _toTS });
  });

  it('from/to request with String with string format', function(){
    var queriable = new Queriable();
    const format = 'DD/MM/YYYY@HH:mm:ss.SSS';
    const _fromTS = moment().subtract(3, 'seconds').valueOf();
    const _toTS = moment().subtract(1, 'seconds').valueOf();
    const _from = moment(_fromTS).format(format);
    const _to = moment(_toTS).format(format);

    queriable.from(_from, format).to(_to, format);

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('from', 'to');
    expect(query).to.eql({ from: _fromTS, to: _toTS });
  });

  it('app request', function(){
    var queriable = new Queriable();

    queriable.app('APP');

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('app');
    expect(query).to.eql({ app: 'APP' });
  });

  it('level request', function(){
    var queriable = new Queriable();

    queriable.level(LoggerageLevel.INFO);

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('level');
    expect(query).to.eql({ level: LoggerageLevel.INFO });
  });

  it('version request', function(){
    var queriable = new Queriable();

    queriable.version('version');

    const query = queriable.getQueryRequest();

    expect(query).to.only.have.keys('version');
    expect(query).to.eql({ version: 'version' });
  });

});
