const expect = require('expect.js');
const localStorage = require('localStorage');
const promisify = require('promisify-node');
global.localStorage = localStorage;
const Loggerage = require("../build/loggerage").Loggerage;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;
const LoggerageOptions = require("../build/loggerage").LoggerageOptions;
const AsyncStorage = require('./async-storage');
const asyncStorage = new AsyncStorage();

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

  describe("Test OLD constructor", function () {
    it("app is equal to (Date.now() + i)", function() {
      const app = Date.now() + i;
      i += 1;
      logger = new Loggerage(app, LoggerageLevel.INFO);
      asyncLogger = getAsyncLogger(app, LoggerageLevel.INFO);
      expect(logger.getApp()).to.equal(app);
      expect(asyncLogger.getApp()).to.equal(app);
    });

    it("log level is equal to INFO", function() {
      logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO);
      asyncLogger = getAsyncLogger(Date.now() + i, LoggerageLevel.INFO);
      i += 1;
      expect(logger.getDefaultLogLevel()).to.equal("INFO");
      expect(asyncLogger.getDefaultLogLevel()).to.equal("INFO");
    });

    it("version is equal to 2", function() {
      logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO, 2);
      asyncLogger = getAsyncLogger(Date.now() + i, LoggerageLevel.INFO, 2);
      i += 1;
      expect(logger.getVersion()).to.equal(2);
      expect(asyncLogger.getVersion()).to.equal(2);
    });
  });

  describe("Test NEW constructor", function () {
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

    it("if storage not implement correct interface, throw error when construction", function() {
      const options = new LoggerageOptions();
      options.storage = {};
      i += 1;
      expect(function() {
        logger = new Loggerage(Date.now() + i, options);
      }).to.throwException('[storage] param not implement \'getItem\' or \'setItem\' method');
    });

    it("with own storage in constructor, has 1 log", function() {
      const options = new LoggerageOptions();
      options.storage = {
        data: {},
        getItem: function(key) {
          return this.data[key];
        },
        setItem: function(key, value) {
          this.data[key] = value;
        }
      };
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
      asyncLogger.getLogAsync().then(function(data){
        expect(data).to.be.empty();
      }).catch(console.error);
    });

    it("has 1 log", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log).to.have.length(1);
      asyncLogger.infoAsync("One log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data).to.have.length(1);
        }).catch(console.error);
      }).catch(console.error);
    });

    it("has 3 logs", function() {
      Array.apply(null, Array(3)).forEach(function() {
        logger.info("Log");
      });
      const log = logger.getLog();
      expect(log).to.have.length(3);
      var arrPromise = Array.apply(null, Array(3)).map(function() {
        return asyncLogger.infoAsync("Log");
      });
      asyncLogger.infoAsync("Log").then(function(){
        asyncLogger.infoAsync("Log").then(function(){
          asyncLogger.infoAsync("Log").then(function(){
            asyncLogger.getLogAsync().then(function(data){
              expect(data).to.have.length(3);
            }).catch(console.error);
          }).catch(console.error);
        }).catch(console.error);
      }).catch(console.error);
    });

    it("has 100 logs", function() {
      Array.apply(null, Array(100)).forEach(function() {
        logger.debug("Log");
      });
      const log = logger.getLog();
      expect(log).to.have.length(100);
    });

    it("has 1 log with message 'One log' and level INFO", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log).to.have.length(1);
      expect(log[0].level).to.equal("INFO");
      expect(log[0].message).to.equal("One log");
      asyncLogger.infoAsync("One log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data).to.have.length(1);
          expect(data[0].level).to.equal("INFO");
          expect(data[0].message).to.equal("One log");
        }).catch(console.error);
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

      asyncLogger.infoAsync("Log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data).to.have.length(1);
          asyncLogger.clearLogAsync().then(function(){
            asyncLogger.getLogAsync().then(function(data){
              expect(data).to.have.length(0);
            });
          }).catch(console.error);
        }).catch(console.error);
      }).catch(console.error);
    });

    it("has 1 log with level DEBUG", function() {
      logger.debug("One log DEBUG");
      const log = logger.getLog();
      expect(log[0].level).to.equal("DEBUG");
      asyncLogger.debugAsync("One log DEBUG").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("DEBUG");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level TRACE", function() {
      logger.trace("One log TRACE");
      const log = logger.getLog();
      expect(log[0].level).to.equal("TRACE");
      asyncLogger.traceAsync("One log TRACE").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("TRACE");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level SUCCESS", function() {
      logger.success("One log SUCCESS");
      const log = logger.getLog();
      expect(log[0].level).to.equal("SUCCESS");
      asyncLogger.successAsync("One log SUCCESS").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("SUCCESS");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level INFO", function() {
      logger.info("One log INFO");
      const log = logger.getLog();
      expect(log[0].level).to.equal("INFO");
      asyncLogger.infoAsync("One log INFO").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("INFO");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level WARN", function() {
      logger.warn("One log WARN");
      const log = logger.getLog();
      expect(log[0].level).to.equal("WARN");
      asyncLogger.warnAsync("One log WARN").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("WARN");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level ERROR", function() {
      logger.error("One log ERROR");
      const log = logger.getLog();
      expect(log[0].level).to.equal("ERROR");
      asyncLogger.errorAsync("One log ERROR").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("ERROR");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level FAILURE", function() {
      logger.failure("One log FAILURE");
      const log = logger.getLog();
      expect(log[0].level).to.equal("FAILURE");
      asyncLogger.failureAsync("One log FAILURE").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].level).to.equal("FAILURE");
        }).catch(console.error);
      }).catch(console.error);
    });
    it("has 1 log with level ERROR, message 'Error' and stacktrace '[Stack Trace: Error StackTrace]'", function() {
      logger.error("Error", "Error StackTrace");
      const log = logger.getLog();
      expect(log[0].message.split("\n")[0]).to.equal("Error");
      expect(log[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
      asyncLogger.errorAsync("Error", "Error StackTrace").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data[0].message.split("\n")[0]).to.equal("Error");
          expect(data[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
        }).catch(console.error);
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

    it("Fire exception if storage not implement Storage interface", function() {
      global.localStorage = null;
      const _logger = new Loggerage("STORAGE_NOT_CORRECT");
      expect(function() {
        _logger.setStorage({});
      }).to.throwException('[storage] param not implement \'getItem\' or \'setItem\' method');
    });

    it("Fire exception if not exist default localStorage and set before", function() {
      global.localStorage = null;
      const _logger = new Loggerage("WITHOUT_LOCALSTORAGE");
      expect(function() {
        _logger.info("One log");
      }).to.throwException('localStorage not found. Set your Storage by \'.setStorage() method\'');

      _logger.setStorage(localStorage);
      _logger.info("One log");
      const log = _logger.getLog();
      expect(log.length).to.equal(1);
      expect(log[0].message).to.equal("One log");
    });
  });
});


function getAsyncLogger(app, level, version){
  level = level || LoggerageLevel.DEBUG;
  version = version || 1;
  const asyncLogger = new Loggerage(app, level, version);
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
