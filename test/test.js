const expect = require('expect.js');
const localStorage = require('localStorage');
const Loggerage = require("../build/loggerage").Loggerage;
const LoggerageLevel = require("../build/loggerage").LoggerageLevel;

describe("Loggerage", function() {
    var logger = new Loggerage(Date.now());
    logger.setStorage(localStorage);
    var i = 0;

    beforeEach(function() {
        logger = new Loggerage(Date.now() + i);
        logger.setStorage(localStorage);
        i += 1;
    });

    describe("Test constructor", function () {
        it("app es igual a (Date.now() + i)", function() {
            const app = Date.now() + i;
            i += 1;
            logger = new Loggerage(app, LoggerageLevel.INFO);
            expect(logger.getApp()).to.equal(app);
        });

        it("log level es igual a INFO", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO);
            i += 1;
            expect(logger.getDefaultLogLevel()).to.equal("INFO");
        });

        it("version es igual a 2", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO, 2);
            i += 1;
            expect(logger.getVersion()).to.equal(2);
        });
    });

    describe("Test get y set logs", function () {
        it("log vacío de inicio (log == [])", function() {
            const log = logger.getLog();
            expect(log.length).to.equal(0);
        });

        it("tiene 1 log", function() {
            logger.info("Un log");
            const log = logger.getLog();
            expect(log.length).to.equal(1);
        });

        it("tiene 3 logs", function() {
            Array.apply(null, Array(3)).forEach(function() {
                logger.info("Log");
            });
            const log = logger.getLog();
            expect(log.length).to.equal(3);
        });

        it("tiene 100 logs", function() {
            Array.apply(null, Array(100)).forEach(function() {
                logger.debug("Log");
            });
            const log = logger.getLog();
            expect(log.length).to.equal(100);
        });

        it("tiene 1 log con mensaje 'Un log' y level INFO", function() {
            logger.info("Un log");
            const log = logger.getLog();
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
            const log = logger.getLog();
            expect(log[0].level).to.equal("DEBUG");
        });
        it("tiene 1 log con level TRACE", function() {
            logger.trace("Un log TRACE");
            const log = logger.getLog();
            expect(log[0].level).to.equal("TRACE");
        });
        it("tiene 1 log con level SUCCESS", function() {
            logger.success("Un log SUCCESS");
            const log = logger.getLog();
            expect(log[0].level).to.equal("SUCCESS");
        });
        it("tiene 1 log con level INFO", function() {
            logger.info("Un log INFO");
            const log = logger.getLog();
            expect(log[0].level).to.equal("INFO");
        });
        it("tiene 1 log con level WARN", function() {
            logger.warn("Un log WARN");
            const log = logger.getLog();
            expect(log[0].level).to.equal("WARN");
        });
        it("tiene 1 log con level ERROR", function() {
            logger.error("Un log ERROR");
            const log = logger.getLog();
            expect(log[0].level).to.equal("ERROR");
        });
        it("tiene 1 log con level FAILURE", function() {
            logger.failure("Un log FAILURE");
            const log = logger.getLog();
            expect(log[0].level).to.equal("FAILURE");
        });
        it("tiene 1 log con level ERROR, mensaje 'Error' y stacktrace '[Stack Trace: Error StackTrace]'", function() {
            logger.error("Error", "Error StackTrace");
            const log = logger.getLog();
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