var expect = require('expect.js');
var localStorage = require('localStorage');
var LogStorageJS = require("../build/LogStorage").LogStorageJS;

//polyfill for LogStorageJSLevel
var LogStorageLevel;
(function (LogStorageJSLevel) {
    LogStorageJSLevel[LogStorageJSLevel["DEBUG"] = 0] = "DEBUG";
    LogStorageJSLevel[LogStorageJSLevel["TRACE"] = 1] = "TRACE";
    LogStorageJSLevel[LogStorageJSLevel["SUCCESS"] = 2] = "SUCCESS";
    LogStorageJSLevel[LogStorageJSLevel["INFO"] = 3] = "INFO";
    LogStorageJSLevel[LogStorageJSLevel["WARN"] = 4] = "WARN";
    LogStorageJSLevel[LogStorageJSLevel["ERROR"] = 5] = "ERROR";
    LogStorageJSLevel[LogStorageJSLevel["FAILURE"] = 6] = "FAILURE";
})(LogStorageLevel || (LogStorageLevel = {}));

describe("LogStorageJS", function() {
    var logger = new LogStorageJS(Date.now());
    logger.setStorage(localStorage);
    var i = 0;

    beforeEach(function() {
        logger = new LogStorageJS(Date.now() + i);
        logger.setStorage(localStorage);
        i += 1;
    });

    describe("Test constructor", function () {
        it("app es igual a (Date.now() + i)", function() {
            var app = Date.now() + i;
            i += 1;
            logger = new LogStorageJS(app, LogStorageLevel.INFO);
            expect(logger.getApp()).to.equal(app);
        });

        it("log level es igual a INFO", function() {
            logger = new LogStorageJS(Date.now() + i, LogStorageLevel.INFO);
            i += 1;
            expect(logger.getDefaultLogLevel()).to.equal("INFO");
        });

        it("version es igual a 2", function() {
            logger = new LogStorageJS(Date.now() + i, LogStorageLevel.INFO, 2);
            i += 1;
            expect(logger.getVersion()).to.equal(2);
        });
    });

    describe("Test get y set logs", function () {
        it("log vacío de inicio (log == [])", function() {
            var log = logger.getLog();
            expect(log.length).to.equal(0);
        });

        it("tiene 1 log", function() {
            logger.info("Un log");
            var log = logger.getLog();
            expect(log.length).to.equal(1);
        });

        it("tiene 3 logs", function() {
            Array.apply(null, Array(3)).forEach(function() {
                logger.info("Log");
            });
            var log = logger.getLog();
            expect(log.length).to.equal(3);
        });

        it("tiene 100 logs", function() {
            Array.apply(null, Array(100)).forEach(function() {
                logger.debug("Log");
            });
            var log = logger.getLog();
            expect(log.length).to.equal(100);
        });

        it("tiene 1 log con mensaje 'Un log' y level INFO", function() {
            logger.info("Un log");
            var log = logger.getLog();
            expect(log.length).to.equal(1);
            expect(log[0].level).to.equal("INFO");
            expect(log[0].message).to.equal("Un log");
        });

        it("Después de limpiar tiene log vacío (log == [])", function() {
            logger.info("Un log");
            logger.info("Otro log");
            logger.info("Otro log más");
            var log = logger.getLog();
            expect(log.length).to.equal(3);
            logger.clearLog();
            log = logger.getLog();
            expect(log.length).to.equal(0);
        });

        it("tiene 1 log con level DEBUG", function() {
            logger.debug("Un log DEBUG");
            var log = logger.getLog();
            expect(log[0].level).to.equal("DEBUG");
        });
        it("tiene 1 log con level TRACE", function() {
            logger.trace("Un log TRACE");
            var log = logger.getLog();
            expect(log[0].level).to.equal("TRACE");
        });
        it("tiene 1 log con level SUCCESS", function() {
            logger.success("Un log SUCCESS");
            var log = logger.getLog();
            expect(log[0].level).to.equal("SUCCESS");
        });
        it("tiene 1 log con level INFO", function() {
            logger.info("Un log INFO");
            var log = logger.getLog();
            expect(log[0].level).to.equal("INFO");
        });
        it("tiene 1 log con level WARN", function() {
            logger.warn("Un log WARN");
            var log = logger.getLog();
            expect(log[0].level).to.equal("WARN");
        });
        it("tiene 1 log con level ERROR", function() {
            logger.error("Un log ERROR");
            var log = logger.getLog();
            expect(log[0].level).to.equal("ERROR");
        });
        it("tiene 1 log con level FAILURE", function() {
            logger.failure("Un log FAILURE");
            var log = logger.getLog();
            expect(log[0].level).to.equal("FAILURE");
        });
        it("tiene 1 log con level ERROR, mensaje 'Error' y stacktrace '[Stack Trace: Error StackTrace]'", function() {
            logger.error("Error", "Error StackTrace");
            var log = logger.getLog();
            expect(log[0].message.split("\n")[0]).to.equal("Error");
            expect(log[0].message.split("\n")[1]).to.equal("[Stack Trace: Error StackTrace]");
        });
    });

    describe("Sin Blob", function () {
        it("Lanza excepción al descargar archivo porque no existe Blob (borrado)", function () {
            expect(function() {
                logger.downloadFileLog();
            }).to.throwException("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        });
    });
});