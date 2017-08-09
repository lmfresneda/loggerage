const expect = require('expect.js');
const localStorage = require('localStorage');
const promisify = require('promisify-node');
global.localStorage = localStorage;
const Loggerage = require("../build/loggerage").Loggerage;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;
const LoggerageOptions = require("../build/loggerage").LoggerageOptions;
const WrapLocalStorage = require("../build/utils/wrap-localstorage").WrapLocalStorage;
const AsyncStorage = require('./async-storage');
const SyncStorage = require('./sync-storage');

const consoleWarn = console.warn;
console.warn = function(){};

describe("Loggerage", function() {
  var logger = new Loggerage(Date.now());
  var asyncLogger = getAsyncLogger(Date.now());
  var i = 0;

  beforeEach(function() {
    logger = new Loggerage(Date.now() + i);
    asyncLogger = getAsyncLogger(Date.now() + i);
    i += 1;
  });

  describe("Test constructor", function () {
    it("app is equal to (Date.now() + i)", function() {
      const app = Date.now() + i;
      i += 1;
      const options = new LoggerageOptions();
      options.version = 2;
      logger = new Loggerage(app, options);
      expect(logger.getApp()).to.equal(app);
    });

    it("log level is equal to INFO", function() {
      const options = new LoggerageOptions();
      options.defaultLogLevel = LoggerageLevel.INFO;
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(logger.getDefaultLogLevel()).to.equal("INFO");
    });

    it("log level is equal to INFO number", function() {
      const options = new LoggerageOptions();
      options.defaultLogLevel = LoggerageLevel.INFO;
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(logger.getDefaultLogLevelNumber()).to.equal(LoggerageLevel.INFO);
    });

    it("version is equal to 'v2.1' string", function() {
      const options = new LoggerageOptions();
      options.version = 'v2.1';
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(logger.getVersion()).to.equal('v2.1');
    });

    it("version is equal to 2 number", function() {
      const options = new LoggerageOptions();
      options.version = 2;
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(logger.getVersion()).to.equal(2);
    });

    it("silence is false by defult", function() {
      logger = new Loggerage(Date.now() + i);
      i += 1;
      expect(logger.getSilence()).to.be(false);
    });

    it("silence is true if set", function() {
      const options = new LoggerageOptions();
      options.silence = true;
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(logger.getSilence()).to.be.ok();
    });

    it("silence is true if set after", function() {
      logger = new Loggerage(Date.now() + i);
      i += 1;
      expect(logger.getSilence()).to.be(false);
      logger.setSilence(true);
      expect(logger.getSilence()).to.be.ok();
    });

    it("silence console logs is true, see the console if not trace a WARN message before this test", function() {
      // set console.warn
      console.warn = consoleWarn;
      const options = new LoggerageOptions();
      options.isLocalStorage = false; // This causes a warn message to be displayed
      options.silence = true; // This causes that de console logs not to be displayed
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      console.warn = function(){};
      expect(1).to.equal(1);
    });

    it("if no localStorage, throw error when called log methods", function() {
      const options = new LoggerageOptions();
      options.isLocalStorage = false;
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      expect(function() {
        logger.info('One log');
      }).to.throwException('localStorage not found. Set your Storage by \'.setStorage() method\'');
    });

    it("with own storage in constructor, has 1 log", function() {
      const options = new LoggerageOptions();
      options.storage = new SyncStorage();
      logger = new Loggerage(Date.now() + i, options);
      i += 1;
      logger.info("One log");
      const log = logger.getLog();
      expect(log).to.have.length(1);
    });
  });

  describe("Test get and set logs", function () {
    it("empty log in init (log == [])", function() {
      const log = logger.getLog();
      expect(log).to.be.empty();
    });

    it("(Async) empty log in init (log == [])", function() {
      asyncLogger.getLogAsync().then(function(data){
        expect(data).to.be.empty();
      }).catch(console.error);
    });

    it("has 1 log", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log).to.have.length(1);
    });

    it("(Async) has 1 log", function() {
      asyncLogger.infoAsync("One log").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(1);
      }).catch(console.error);
    });

    it("has 3 logs", function() {
      Array.apply(null, Array(3)).forEach(function() {
        logger.info("Log");
      });
      const log = logger.getLog();
      expect(log).to.have.length(3);
    });

    it("(Async) has 3 logs", function() {
      var arrPromise = Array.apply(null, Array(3)).map(function() {
        return asyncLogger.infoAsync("Log");
      });
      Promise.all(arrPromise).then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(3);
      }).catch(console.error);
    });

    it("has 100 logs", function() {
      Array.apply(null, Array(100)).forEach(function() {
        logger.debug("Log");
      });
      const log = logger.getLog();
      expect(log).to.have.length(100);
    });

    it("(Async) has 100 logs", function() {
      var arrPromise = Array.apply(null, Array(100)).map(function() {
        return asyncLogger.infoAsync("Log");
      });
      Promise.all(arrPromise).then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(100);
      }).catch(console.error);
    });

    it("has 1 log with message 'One log' and level INFO", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log).to.have.length(1);
      expect(log[0].level).to.equal("INFO");
      expect(log[0].message).to.equal("One log");
    });

    it("(Async) has 1 log with message 'One log' and level INFO", function() {
      asyncLogger.infoAsync("One log").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(1);
        expect(data[0].level).to.equal("INFO");
        expect(data[0].message).to.equal("One log");
      }).catch(console.error);
    });

    it("Before clear, has empty log (log == [])", function() {
      logger.info("One log");
      logger.info("Other log");
      logger.info("Another log");
      var log = logger.getLog();
      expect(log).to.have.length(3);
      logger.clearLog();
      log = logger.getLog();
      expect(log).to.have.length(0);
    });

    it("(Async) Before clear, has empty log (log == [])", function() {
      asyncLogger.infoAsync("Log").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(1);
        return asyncLogger.clearLogAsync();
      }).then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(0);
      }).catch(console.error);
    });

    it("has 1 log with level DEBUG", function() {
      logger.debug("One log DEBUG");
      const log = logger.getLog();
      expect(log[0].level).to.equal("DEBUG");
    });

    it("(Async) has 1 log with level DEBUG", function() {
      asyncLogger.debugAsync("One log DEBUG").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("DEBUG");
      }).catch(console.error);
    });

    it("has 1 log with level TRACE", function() {
      logger.trace("One log TRACE");
      const log = logger.getLog();
      expect(log[0].level).to.equal("TRACE");
    });

    it("(Async) has 1 log with level TRACE", function() {
      asyncLogger.traceAsync("One log TRACE").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("TRACE");
      }).catch(console.error);
    });

    it("has 1 log with level SUCCESS", function() {
      logger.success("One log SUCCESS");
      const log = logger.getLog();
      expect(log[0].level).to.equal("SUCCESS");
    });

    it("(Async) has 1 log with level SUCCESS", function() {
      asyncLogger.successAsync("One log SUCCESS").then(function(){
        return asyncLogger.getLogAsync()
      }).then(function(data){
        expect(data[0].level).to.equal("SUCCESS");
      }).catch(console.error);
    });

    it("has 1 log with level INFO", function() {
      logger.info("One log INFO");
      const log = logger.getLog();
      expect(log[0].level).to.equal("INFO");
    });

    it("(Async) has 1 log with level INFO", function() {
      logger.info("One log INFO");
      const log = logger.getLog();
      expect(log[0].level).to.equal("INFO");
      asyncLogger.infoAsync("One log INFO").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("INFO");
      }).catch(console.error);
    });

    it("has 1 log with level WARN", function() {
      logger.warn("One log WARN");
      const log = logger.getLog();
      expect(log[0].level).to.equal("WARN");
    });

    it("(Async) has 1 log with level WARN", function() {
      asyncLogger.warnAsync("One log WARN").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("WARN");
      }).catch(console.error);
    });

    it("has 1 log with level ERROR", function() {
      logger.error("One log ERROR");
      const log = logger.getLog();
      expect(log[0].level).to.equal("ERROR");
    });

    it("(Async) has 1 log with level ERROR", function() {
      asyncLogger.errorAsync("One log ERROR").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("ERROR");
      }).catch(console.error);
    });

    it("has 1 log with level FAILURE", function() {
      logger.failure("One log FAILURE");
      const log = logger.getLog();
      expect(log[0].level).to.equal("FAILURE");
    });

    it("(Async) has 1 log with level FAILURE", function() {
      asyncLogger.failureAsync("One log FAILURE").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].level).to.equal("FAILURE");
      }).catch(console.error);
    });

    it("has 1 log with level ERROR, message 'Error' and stacktrace '[Stack Trace: Error StackTrace]'", function() {
      logger.error("Error", "Error StackTrace");
      const log = logger.getLog();
      expect(log[0].message.split("\n")[0]).to.equal("Error");
      expect(log[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
    });

    it("(Async) has 1 log with level ERROR, message 'Error' and stacktrace '[Stack Trace: Error StackTrace]'", function() {
      asyncLogger.errorAsync("Error", "Error StackTrace").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data[0].message.split("\n")[0]).to.equal("Error");
        expect(data[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
      }).catch(console.error);
    });

    it("(Async) call async methods with sync storage", function() {
      asyncLogger.setStorage(new SyncStorage);
      asyncLogger.infoAsync("One async log").then(function(){
        return asyncLogger.getLogAsync();
      }).then(function(data){
        expect(data).to.have.length(1);
      }).catch(console.error);
    });
  });

  describe("Without Blob", function () {
    it("Fire exception if not exist Blob object (removed in this case) in download file", function () {
      expect(function() {
        logger.downloadFileLog();
      }).to.throwException("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
    });
  });

  describe("Without localStorage by default", function() {
    it("Fire exception if not exist default localStorage and not set it", function() {
      global.localStorage = null;
      const _logger = new Loggerage("WITHOUT_LOCALSTORAGE");
      expect(function() {
        _logger.info("One log");
      }).to.throwException('localStorage not found. Set your Storage by \'.setStorage() method\'');
    });

    it("Fire exception if not exist default localStorage and set before", function() {
      global.localStorage = null;
      const _logger = new Loggerage("WITHOUT_LOCALSTORAGE");
      expect(function() {
        _logger.info("One log");
      }).to.throwException('localStorage not found. Set your Storage by \'.setStorage() method\'');
      _logger.setStorage(new SyncStorage());
      _logger.info("One log");
      const log = _logger.getLog();
      global.localStorage = localStorage;
      expect(log).to.have.length(1);
      expect(log[0].message).to.equal("One log");
    });
  });

  describe('Stored loggers', function(){
    it('loggers are stored', function(){
      new Loggerage("LOGGER_1");
      new Loggerage("LOGGER_2");
      new Loggerage("LOGGER_3");
      const logger1 = Loggerage.getLogger('LOGGER_1');
      const logger2 = Loggerage.getLogger('LOGGER_2');
      const logger3 = Loggerage.getLogger('LOGGER_3');
      expect(logger1.getApp()).to.equal("LOGGER_1");
      expect(logger2.getApp()).to.equal("LOGGER_2");
      expect(logger3.getApp()).to.equal("LOGGER_3");
    });
    it('Destroy stored logger', function(){
      new Loggerage("LOGGER_1");
      let logger = Loggerage.getLogger('LOGGER_1');
      expect(logger.getApp()).to.equal("LOGGER_1");
      Loggerage.destroy(logger.getApp());
      logger = Loggerage.getLogger('LOGGER_1');
      expect(logger).not.to.be.ok();
    });
  });
});


function getAsyncLogger(app){
  const asyncLogger = new Loggerage(app);
  asyncLogger.setStorage(new AsyncStorage());
  asyncLogger.getLogAsync = promisify(asyncLogger.getLogAsync);
  asyncLogger.infoAsync = promisify(asyncLogger.infoAsync);
  asyncLogger.debugAsync = promisify(asyncLogger.debugAsync);
  asyncLogger.traceAsync = promisify(asyncLogger.traceAsync);
  asyncLogger.errorAsync = promisify(asyncLogger.errorAsync);
  asyncLogger.successAsync = promisify(asyncLogger.successAsync);
  asyncLogger.warnAsync = promisify(asyncLogger.warnAsync);
  asyncLogger.failureAsync = promisify(asyncLogger.failureAsync);
  asyncLogger.clearLogAsync = promisify(asyncLogger.clearLogAsync);
  return asyncLogger;
}
