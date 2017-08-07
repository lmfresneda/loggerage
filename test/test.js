const expect = require('expect.js');
const localStorage = require('localStorage');
const promisify = require('promisify-node');
global.localStorage = localStorage;
const Loggerage = require("../build/loggerage").Loggerage;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;
const AsyncStorage = require('./async-storage');
const asyncStorage = new AsyncStorage();

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

  describe("Test get and set logs", function () {
    it("empty log in init (log == [])", function() {
      const log = logger.getLog();
      expect(log.length).to.equal(0);
      asyncLogger.getLogAsync().then(function(data){
        expect(data.length).to.equal(0);
      }).catch(console.error);
    });

    it("has 1 log", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log.length).to.equal(1);
      asyncLogger.infoAsync("One log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data.length).to.equal(1);
        }).catch(console.error);    
      }).catch(console.error);
    });

    it("has 3 logs", function() {
      Array.apply(null, Array(3)).forEach(function() {
        logger.info("Log");
      });
      const log = logger.getLog();
      expect(log.length).to.equal(3);
      var arrPromise = Array.apply(null, Array(3)).map(function() {
        return asyncLogger.infoAsync("Log");
      });
      asyncLogger.infoAsync("Log").then(function(){
        asyncLogger.infoAsync("Log").then(function(){
          asyncLogger.infoAsync("Log").then(function(){
            asyncLogger.getLogAsync().then(function(data){
              expect(data.length).to.equal(3);
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
      expect(log.length).to.equal(100);
    });

    it("has 1 log with message 'One log' and level INFO", function() {
      logger.info("One log");
      const log = logger.getLog();
      expect(log.length).to.equal(1);
      expect(log[0].level).to.equal("INFO");
      expect(log[0].message).to.equal("One log");
      asyncLogger.infoAsync("One log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data.length).to.equal(1);
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
      expect(log.length).to.equal(3);
      logger.clearLog();
      log = logger.getLog();
      expect(log.length).to.equal(0);

      asyncLogger.infoAsync("Log").then(function(){
        asyncLogger.getLogAsync().then(function(data){
          expect(data.length).to.equal(1);
          asyncLogger.clearLogAsync().then(function(){
            asyncLogger.getLogAsync().then(function(data){
              expect(data.length).to.equal(0);
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
      }).to.throwException('[otherStorage] param not implement \'getItem\' or \'setItem\' method');
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
