(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/**
 * loggerage.js v1.0.0
 * (c) lmfresneda <https://github.com/lmfresneda/loggerage>
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Loggerage = (function () {
    /**
     * Constructor for Loggerage
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    function Loggerage(app, defaultLogLevel, version) {
        if (defaultLogLevel === void 0) { defaultLogLevel = LoggerageLevel.DEBUG; }
        if (version === void 0) { version = 1; }
        try {
            if (!window.localStorage) {
                throw new Error("[localStorage] not exist in your app");
            }
            this.__localStorage__ = window.localStorage;
        }
        catch (e) {
            if (e.message == "[localStorage] not exist in your app")
                throw e;
        }
        this.__app__ = app;
        this.__version__ = version;
        this.__defaultLogLevel__ = defaultLogLevel;
    }
    /**
     * Set localStorage for test for example
     * @param otherStorage
     * @returns {Loggerage}
     */
    Loggerage.prototype.setStorage = function (otherStorage) {
        this.__localStorage__ = otherStorage;
        return this;
    };
    /**
     * Return de app version
     * @returns {number}
     */
    Loggerage.prototype.getVersion = function () { return this.__version__; };
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    Loggerage.prototype.getApp = function () { return this.__app__; };
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {Loggerage}
     */
    Loggerage.prototype.setDefaultLogLevel = function (defaultLogLevel) {
        this.__defaultLogLevel__ = defaultLogLevel;
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    Loggerage.prototype.getDefaultLogLevel = function () {
        return LoggerageLevel[this.__defaultLogLevel__];
    };
    /**
     * Get the actual log
     * @returns {Array<LoggerageObject>}
     */
    Loggerage.prototype.getLog = function () {
        var logs = JSON.parse(this.__localStorage__.getItem(this.__app__) || "[]");
        return logs;
    };
    /**
     * Clear all the log
     * @returns {Loggerage}
     */
    Loggerage.prototype.clearLog = function () {
        this.__localStorage__.setItem(this.getApp(), "[]");
        return this;
    };
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {Loggerage}
     */
    Loggerage.prototype.downloadFileLog = function (type) {
        if (type === void 0) { type = "txt"; }
        if (Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            var contenido = "";
            switch (type.toLowerCase()) {
                case "txt":
                    contenido = Loggerage.__buildTxtContent__(this.getLog());
                    break;
                case "csv":
                    contenido = Loggerage.__buildCsvContent__(this.getLog());
                    break;
            }
            var blob = Loggerage.__getBlob__(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            Loggerage.__downloadBlob__(blob, nameFile);
        }
        else {
            throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        }
        return this;
    };
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {Loggerage}
     */
    Loggerage.prototype.log = function (logLevel, message, stacktrace) {
        if (logLevel === void 0) { logLevel = this.__defaultLogLevel__; }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this.__makeObjectToLog__(logLevel, message);
        var logs = this.getLog();
        logs.push(logObj);
        this.__localStorage__.setItem(this.__app__, JSON.stringify(logs));
        return this;
    };
    /**
     * Log an info message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.info = function (message) {
        return this.log(LoggerageLevel.INFO, message);
    };
    /**
     * Log a debug message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.debug = function (message) {
        return this.log(LoggerageLevel.DEBUG, message);
    };
    /**
     * Log a trace message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.trace = function (message) {
        return this.log(LoggerageLevel.TRACE, message);
    };
    /**
     * Log a success message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.success = function (message) {
        return this.log(LoggerageLevel.SUCCESS, message);
    };
    /**
     * Log a warn message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.warn = function (message) {
        return this.log(LoggerageLevel.WARN, message);
    };
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    Loggerage.prototype.error = function (message, stacktrace) {
        return this.log(LoggerageLevel.ERROR, message, stacktrace);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    Loggerage.prototype.failure = function (message, stacktrace) {
        return this.log(LoggerageLevel.FAILURE, message, stacktrace);
    };
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    Loggerage.prototype.__makeObjectToLog__ = function (logLevel, message) {
        if (logLevel === void 0) { logLevel = this.__defaultLogLevel__; }
        var logObj = new LoggerageObject(LoggerageLevel[logLevel], message);
        return logObj;
    };
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    Loggerage.__buildCsvContent__ = function (ar) {
        var contenido = "";
        if (!ar.length)
            return contenido;
        contenido += Object.keys(ar[0]).join(";") + "\n";
        ar.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) {
                return obj[key];
            }).join(";") + "\n";
        });
        return contenido;
    };
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    Loggerage.__buildTxtContent__ = function (ar) {
        var contenido = "";
        if (!ar.length)
            return contenido;
        ar.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) {
                return obj[key];
            }).join("\t") + "\n";
        });
        return contenido;
    };
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     * @private
     */
    Loggerage.__getBlob__ = function (content, type) {
        if (type === void 0) { type = "txt"; }
        var blob;
        var mime = 'text/plain';
        switch (type.toLowerCase()) {
            case "csv":
                mime = 'text/csv';
                break;
        }
        blob = new Blob(["\ufeff", content], { type: mime });
        return blob;
    };
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     * @private
     */
    Loggerage.__downloadBlob__ = function (blob, nameFile) {
        //[http://lmfresneda.esy.es/javascript/crear-archivo-csv-con-array-de-objecto-en-javascript/]
        var reader = new FileReader();
        var save;
        reader.onload = function (event) {
            save = document.createElement('a');
            save.href = event.target["result"];
            save.target = '_blank';
            save.download = nameFile;
            var clicEvent;
            try {
                clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
            }
            catch (e) {
                clicEvent = document.createEvent("MouseEvent");
                clicEvent.initEvent('click', true, true);
            }
            save.dispatchEvent(clicEvent);
            (window.URL || window["webkitURL"]).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(blob);
    };
    return Loggerage;
}());
exports.Loggerage = Loggerage;
var LoggerageObject = (function () {
    function LoggerageObject(level, message) {
        var now = new Date();
        this.date = now.toLocaleString();
        this.level = level;
        this.message = message;
    }
    return LoggerageObject;
}());
exports.LoggerageObject = LoggerageObject;
var LoggerageLevel;
(function (LoggerageLevel) {
    LoggerageLevel[LoggerageLevel["DEBUG"] = 0] = "DEBUG";
    LoggerageLevel[LoggerageLevel["TRACE"] = 1] = "TRACE";
    LoggerageLevel[LoggerageLevel["SUCCESS"] = 2] = "SUCCESS";
    LoggerageLevel[LoggerageLevel["INFO"] = 3] = "INFO";
    LoggerageLevel[LoggerageLevel["WARN"] = 4] = "WARN";
    LoggerageLevel[LoggerageLevel["ERROR"] = 5] = "ERROR";
    LoggerageLevel[LoggerageLevel["FAILURE"] = 6] = "FAILURE";
})(LoggerageLevel = exports.LoggerageLevel || (exports.LoggerageLevel = {}));
},{}],2:[function(require,module,exports){
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

},{"../../../build/loggerage":1}]},{},[2]);
