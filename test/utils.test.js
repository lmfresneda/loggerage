const expect = require('expect.js');
const moment = require('moment');
const Utils = require("../build/utils/utils").Utils;
const LoggerageObject = require('../build/loggerage-object').LoggerageObject;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;
const Query = require("../build/utils/query").Query;
const Queriable = require("../build/utils/query").Queriable;

describe("Utils", function() {

  it("# getLogFiltered()", function(done) {
    this.timeout(2500);
    var logs = [
      new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '1 info log', 'MY-APP', 1),
      new LoggerageObject(LoggerageLevel[LoggerageLevel.INFO], '2 info log', 'MY-APP', 1),
      new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '1 debug log', 'MY-APP', 1),
      new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '2 debug log', 'MY-APP', 2),
      new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '3 debug log', 'MY-APP', 2),
      new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '4 debug log', 'MY-APP-2', 2)
    ];

    setTimeout(() => {
      logs = logs.concat([
        new LoggerageObject(LoggerageLevel[LoggerageLevel.DEBUG], '5 debug log', 'MY-APP-2', 2),
        new LoggerageObject(LoggerageLevel[LoggerageLevel.ERROR], '1 error log', 'MY-APP', 1),
        new LoggerageObject(LoggerageLevel[LoggerageLevel.ERROR], '2 error log', 'MY-APP-2', 1),
        new LoggerageObject(LoggerageLevel[LoggerageLevel.ERROR], '3 error log', 'MY-APP', 2)
      ]);

      var queriable = new Queriable();

      queriable.from(moment().subtract(3, 'seconds'))
                .to(moment().subtract(1, 'second'));
      var log = Utils.getLogFiltered(logs, queriable.getQueryRequest());
      expect(log).to.have.length(6);

      queriable.version(1);

      log = Utils.getLogFiltered(logs, queriable.getQueryRequest());
      expect(log).to.have.length(3);

      queriable.level(LoggerageLevel.DEBUG);
      log = Utils.getLogFiltered(logs, queriable.getQueryRequest());
      expect(log).to.have.length(1);

      queriable.resetQuery();
      queriable.app('MY-APP-2');
      log = Utils.getLogFiltered(logs, queriable.getQueryRequest());
      expect(log).to.have.length(3);

      done();

    }, 2000);
  });

  it("# getLogFiltered() with array null", function() {
      var log = Utils.getLogFiltered(null);
      expect(log).not.to.be.ok();
  });

  it("# getLogFiltered() with empty array", function() {
      var log = Utils.getLogFiltered([]);
      expect(log).to.have.length(0);
  });

  it("# getLogFiltered() with query null", function() {
      var log = Utils.getLogFiltered([{}], null);
      expect(log).to.have.length(1);
  });

  it("# getUnixDate()", function() {
    const now = Date.now();
    expect(Utils.getUnixDate(now)).to.be.equal(now);
    expect(Utils.getUnixDate(new Date(now))).to.be.equal(now);
    expect(Utils.getUnixDate(moment(now))).to.be.equal(now);
    expect(Utils.getUnixDate(
      moment(now).format('DD/MM/YYYY HH:mm'), 'DD/MM/YYYY HH:mm'
    )).to.be.equal(
      moment(moment(now).format('DD/MM/YYYY HH:mm'), 'DD/MM/YYYY HH:mm').valueOf());

    expect(Utils.getUnixDate(
      moment(now).format('YYYY-MM-DD HH:mm:ss.SSS')
    )).to.be.equal(now);
  });

  it("# buildCsvContent()", function() {
    const arr = [
      { field1: 'value1', field2: 'value2' },
      { field1: 'value11', field2: 'value22' }
    ];

    const txt = Utils.buildCsvContent(arr);

    expect(txt).to.be.equal(
      'field1;field2\nvalue1;value2\nvalue11;value22\n'
    );
  });

  it("# buildCsvContent() with empty array", function() {
    const arr = [];

    const csv = Utils.buildCsvContent(arr);

    expect(csv).to.be.equal('');
  });

  it("# buildTxtContent()", function() {
    const arr = [
      { field1: 'value1', field2: 'value2' },
      { field1: 'value11', field2: 'value22' }
    ];

    const txt = Utils.buildTxtContent(arr);

    expect(txt).to.be.equal(
      'field1\tfield2\nvalue1\tvalue2\nvalue11\tvalue22\n'
    );
  });

  it("# buildTxtContent() with empty array", function() {

    const arr = [];

    const txt = Utils.buildTxtContent(arr);

    expect(txt).to.be.equal('');
  });
});
