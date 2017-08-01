const { Loggerage, LoggerageLevel } = require("../../../build/loggerage");

describe("loggerage", function() {
    var logger = new Loggerage(Date.now());
    var i = 0;

    //polyfill for localStorage
    (function (isStorage) {
        if (!isStorage) {
            var data = {},
                undef;
            window.localStorage = {
                setItem     : function(id, val) { return data[id] = String(val); },
                getItem     : function(id) { return data.hasOwnProperty(id) ? data[id] : undef; },
                removeItem  : function(id) { return delete data[id]; },
                clear       : function() { return data = {}; }
            };
        }
    })((function () {
        try {
            return "localStorage" in window && window.localStorage != null;
        } catch (e) {
            return false;
        }
    })());

    beforeEach(function() {
        logger = new Loggerage(Date.now() + i);
        i += 1;
    });

    afterEach(function () {
        localStorage.clear();
    });

    describe("Test constructor", function () {
        it("app es igual a (Date.now() + i)", function() {
            var app = Date.now() + i;
            i += 1;
            logger = new Loggerage(app, LoggerageLevel.INFO);
            expect(logger.getApp()).toEqual(app);
        });

        it("log level es igual a INFO", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO);
            i += 1;
            expect(logger.getDefaultLogLevel()).toEqual("INFO");
        });

        it("version es igual a 2", function() {
            logger = new Loggerage(Date.now() + i, LoggerageLevel.INFO, 2);
            i += 1;
            expect(logger.getVersion()).toEqual(2);
        });
    });

    describe("Test get y set logs", function () {
        it("log vacío de inicio (log == [])", function() {
            var log = logger.getLog();
            expect(log.length).toEqual(0);
        });

        it("tiene 1 log", function() {
            logger.info("Un log");
            var log = logger.getLog();
            expect(log.length).toEqual(1);
        });

        it("tiene 3 logs", function() {
            Array.apply(null, Array(3)).forEach(function() {
                logger.info("Log");
            });
            var log = logger.getLog();
            expect(log.length).toEqual(3);
        });

        it("tiene 100 logs", function() {
            Array.apply(null, Array(100)).forEach(function() {
                logger.debug("Log");
            });
            var log = logger.getLog();
            expect(log.length).toEqual(100);
        });

        it("tiene 1 log con mensaje 'Un log' y level INFO", function() {
            logger.info("Un log");
            var log = logger.getLog();
            expect(log.length).toEqual(1);
            expect(log[0].level).toEqual("INFO");
            expect(log[0].message).toEqual("Un log");
        });

        it("Después de limpiar tiene log vacío (log == [])", function() {
            logger.info("Un log");
            logger.info("Otro log");
            logger.info("Otro log más");
            var log = logger.getLog();
            expect(log.length).toEqual(3);
            logger.clearLog();
            log = logger.getLog();
            expect(log.length).toEqual(0);
        });

        it("tiene 1 log con level DEBUG", function() {
            logger.debug("Un log DEBUG");
            var log = logger.getLog();
            expect(log[0].level).toEqual("DEBUG");
        });
        it("tiene 1 log con level TRACE", function() {
            logger.trace("Un log TRACE");
            var log = logger.getLog();
            expect(log[0].level).toEqual("TRACE");
        });
        it("tiene 1 log con level SUCCESS", function() {
            logger.success("Un log SUCCESS");
            var log = logger.getLog();
            expect(log[0].level).toEqual("SUCCESS");
        });
        it("tiene 1 log con level INFO", function() {
            logger.info("Un log INFO");
            var log = logger.getLog();
            expect(log[0].level).toEqual("INFO");
        });
        it("tiene 1 log con level WARN", function() {
            logger.warn("Un log WARN");
            var log = logger.getLog();
            expect(log[0].level).toEqual("WARN");
        });
        it("tiene 1 log con level ERROR", function() {
            logger.error("Un log ERROR");
            var log = logger.getLog();
            expect(log[0].level).toEqual("ERROR");
        });
        it("tiene 1 log con level FAILURE", function() {
            logger.failure("Un log FAILURE");
            var log = logger.getLog();
            expect(log[0].level).toEqual("FAILURE");
        });
        it("tiene 1 log con level ERROR, mensaje 'Error' y stacktrace '[Stack Trace: Error StackTrace]'", function() {
            logger.error("Error", "Error StackTrace");
            var log = logger.getLog();
            expect(log[0].message.split("\n")[0]).toEqual("Error");
            expect(log[0].message.split("\n")[1]).toEqual("[Stack Trace: Error StackTrace]");
        });
    });

    describe("Sin localStorage ni Blob", function () {
        it("Lanza excepción al descargar archivo porque no existe Blob (borrado)", function () {
            if(Blob) Blob = undefined;
            expect(function() {
                logger.downloadFileLog();
            }).toThrowError("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        });

        it("Lanza excepción al construir porque no existe localStorage (borrado)", function () {
            var _localStorage;
            if(window.localStorage) {
                _localStorage = window.localStorage;
                delete window.localStorage;
            }
            expect(function() {
                new Loggerage("ThrowError");
            }).toThrowError("[localStorage] not exist in your app");
            window.localStorage = _localStorage;
        });
    });




});
