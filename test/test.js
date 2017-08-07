const expect = require('expect.js');
const localStorage = require('localStorage');
global.localStorage = localStorage;
const Loggerage = require("../build/loggerage").Loggerage;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;

describe("Loggerage", function() {
    var logger = new Loggerage(Date.now());
    // logger.setStorage(localStorage);
    var i = 0;

    beforeEach(function() {
        logger = new Loggerage(Date.now() + i);
        // logger.setStorage(localStorage);
        i += 1;
    });

    describe("Test constructor", function () {
        it("app is equal to (Date.now() + i)", function() {
            const app = Date.now() + i;
            i += 1;
            logger = new Loggerage(app, LoggerageLevel.INFO);
            expect(logger.getApp()).to.equal(app);
        });

        it("log level is equal to INFO", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO);
            i += 1;
            expect(logger.getDefaultLogLevel()).to.equal("INFO");
        });

        it("version is equal to 2", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO, 2);
            i += 1;
            expect(logger.getVersion()).to.equal(2);
        });
    });

    describe("Test get and set logs", function () {
        it("empty log in init (log == [])", function() {
            const log = logger.getLog();
            expect(log.length).to.equal(0);
        });

        it("has 1 log", function() {
            logger.info("One log");
            const log = logger.getLog();
            expect(log.length).to.equal(1);
        });

        it("has 3 logs", function() {
            Array.apply(null, Array(3)).forEach(function() {
                logger.info("Log");
            });
            const log = logger.getLog();
            expect(log.length).to.equal(3);
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
        });

        it("has 1 log with level DEBUG", function() {
            logger.debug("One log DEBUG");
            const log = logger.getLog();
            expect(log[0].level).to.equal("DEBUG");
        });
        it("has 1 log with level TRACE", function() {
            logger.trace("One log TRACE");
            const log = logger.getLog();
            expect(log[0].level).to.equal("TRACE");
        });
        it("has 1 log with level SUCCESS", function() {
            logger.success("One log SUCCESS");
            const log = logger.getLog();
            expect(log[0].level).to.equal("SUCCESS");
        });
        it("has 1 log with level INFO", function() {
            logger.info("One log INFO");
            const log = logger.getLog();
            expect(log[0].level).to.equal("INFO");
        });
        it("has 1 log with level WARN", function() {
            logger.warn("One log WARN");
            const log = logger.getLog();
            expect(log[0].level).to.equal("WARN");
        });
        it("has 1 log with level ERROR", function() {
            logger.error("One log ERROR");
            const log = logger.getLog();
            expect(log[0].level).to.equal("ERROR");
        });
        it("has 1 log with level FAILURE", function() {
            logger.failure("One log FAILURE");
            const log = logger.getLog();
            expect(log[0].level).to.equal("FAILURE");
        });
        it("has 1 log with level ERROR, message 'Error' and stacktrace '[Stack Trace: Error StackTrace]'", function() {
            logger.error("Error", "Error StackTrace");
            const log = logger.getLog();
            expect(log[0].message.split("\n")[0]).to.equal("Error");
            expect(log[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
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
            
            _logger.setStorage(localStorage);
            _logger.info("One log");
            const log = _logger.getLog();
            expect(log.length).to.equal(1);
            expect(log[0].message).to.equal("One log");
        });
    });
});