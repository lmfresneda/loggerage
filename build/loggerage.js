"use strict";
/// <reference types="es6-promise" />
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * (c) loggerage contributors
 * https://github.com/lmfresneda/loggerage
 */
var colors = require("colors");
var assign = require("object-assign");
var utils_1 = require("./utils/utils");
var wrap_localstorage_1 = require("./utils/wrap-localstorage");
var query_1 = require("./utils/query");
var download_1 = require("./utils/download");
var loggerage_options_1 = require("./loggerage-options");
exports.LoggerageOptions = loggerage_options_1.LoggerageOptions;
var loggerage_object_1 = require("./loggerage-object");
exports.LoggerageObject = loggerage_object_1.LoggerageObject;
var loggerage_level_1 = require("./loggerage-level");
exports.LoggerageLevel = loggerage_level_1.LoggerageLevel;
/**
 * Loggerage class
 */
var Loggerage = (function () {
    //========================//
    //      CONSTRUCTOR       //
    //========================//
    /**
     * Constructor for Loggerage
     * @param app    App or Logger name
     * @param rest   Optional parameters
     */
    function Loggerage(app, options) {
        /**
         * Indicate if localStorage is ok (false by default)
         */
        this._isStorageOk = false;
        // super();
        this._options = new loggerage_options_1.LoggerageOptions();
        if (options)
            this._options = assign(this._options, options);
        if (!this._options.storage && this._options.isLocalStorage) {
            try {
                if (window.localStorage)
                    this._options.storage = new wrap_localstorage_1.WrapLocalStorage(window.localStorage);
            }
            catch (e) {
                if (e.message !== 'window is not defined')
                    throw e;
                try {
                    if (global.localStorage)
                        this._options.storage = new wrap_localstorage_1.WrapLocalStorage(global.localStorage);
                }
                catch (e) {
                    if (e.message !== 'global is not defined')
                        throw e;
                }
            }
        }
        if (this._options.storage) {
            this._isStorageOk = true;
        }
        else if (!this._options.silence) {
            console.warn(colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
        }
        this._app = app;
        Loggerage._loggers[this._app] = this;
        this.resetQuery();
    }
    //====================//
    //      STORAGE       //
    //====================//
    /**
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    Loggerage.prototype.setStorage = function (storage) {
        this._options.storage = storage;
        this._isStorageOk = true;
        this.resetQuery();
        return this;
    };
    //====================//
    //      GET LOG       //
    //====================//
    /**
     * Get the actual log
     * @returns {LoggerageObject[]}
     */
    Loggerage.prototype.getLog = function () {
        var logs = (this._options.storage.getItem(this._app, this.isQueryRequested ? this.getQueryRequest() : null));
        this.resetQuery();
        return logs;
    };
    /**
     * Get the actual log asynchronously
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
     * @returns {void}
     */
    Loggerage.prototype.getLogAsync = function (callback) {
        var _this = this;
        Promise.resolve(this._options.storage.getItem(this._app, this.isQueryRequested ? this.getQueryRequest() : null)).then(function (data) {
            _this.resetQuery();
            callback(null, data);
        }).catch(function (err) {
            _this.resetQuery();
            callback(err);
        });
    };
    //================================//
    //      GET/SET INFO LOGGER       //
    //================================//
    /**
     * Return the app version
     * @returns {number}
     */
    Loggerage.prototype.getVersion = function () {
        this.resetQuery();
        return this._options.version;
    };
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    Loggerage.prototype.getApp = function () {
        this.resetQuery();
        return this._app;
    };
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {Loggerage}
     */
    Loggerage.prototype.setDefaultLogLevel = function (defaultLogLevel) {
        this._options.defaultLogLevel = defaultLogLevel;
        this.resetQuery();
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    Loggerage.prototype.getDefaultLogLevel = function () {
        this.resetQuery();
        return loggerage_level_1.LoggerageLevel[this._options.defaultLogLevel];
    };
    /**
     * Get the default log level number
     * @returns {number}
     */
    Loggerage.prototype.getDefaultLogLevelNumber = function () {
        this.resetQuery();
        return this._options.defaultLogLevel;
    };
    /**
     * Set the silence property
     * @param silence
     * @returns {Loggerage}
     */
    Loggerage.prototype.setSilence = function (silence) {
        this._options.silence = silence;
        this.resetQuery();
        return this;
    };
    /**
     * Get the silence property
     * @returns {boolean}
     */
    Loggerage.prototype.getSilence = function () {
        this.resetQuery();
        return this._options.silence;
    };
    //======================//
    //      CLEAR LOG       //
    //======================//
    /**
     * Clear all the log
     * @returns {Loggerage}
     */
    Loggerage.prototype.clearLog = function () {
        this._options.storage.clear();
        this.resetQuery();
        return this;
    };
    /**
     * Clear all the log asynchronously
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.clearLogAsync = function (callback) {
        var _this = this;
        Promise.resolve(this._options.storage.clear()).then(function () {
            _this.resetQuery();
            callback(null);
        }).catch(function (err) {
            _this.resetQuery();
            callback(err);
        });
    };
    //========================//
    //      LOG METHODS       //
    //========================//
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {Loggerage}
     */
    Loggerage.prototype.log = function (logLevel, message, stacktrace) {
        if (logLevel === void 0) { logLevel = this._options.defaultLogLevel; }
        if (!this._isStorageOk) {
            throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');
        }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this._makeLoggerageObject(logLevel, message);
        this._options.storage.setItem(this._app, logObj);
        this.resetQuery();
        return this;
    };
    /**
     * Log a message of all levels
     * @param logLevel       Level log
     * @param message        Message to log
     * @param stacktrace     (Can be null)
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.logAsync = function (logLevel, message, stacktrace, callback) {
        var _this = this;
        if (logLevel === void 0) { logLevel = this._options.defaultLogLevel; }
        if (!this._isStorageOk) {
            return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
        }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this._makeLoggerageObject(logLevel, message);
        Promise.resolve(this._options.storage.setItem(this._app, logObj)).then(function () {
            _this.resetQuery();
            callback(null);
        }).catch(function (err) {
            _this.resetQuery();
            callback(err);
        });
    };
    //=============================//
    //      EASY LOG METHODS       //
    //=============================//
    /**
     * Log a debug message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.debug = function (message) {
        return this.log(loggerage_level_1.LoggerageLevel.DEBUG, message);
    };
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.debugAsync = function (message, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.DEBUG, message, null, callback);
    };
    /**
     * Log an info message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.info = function (message) {
        return this.log(loggerage_level_1.LoggerageLevel.INFO, message);
    };
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.infoAsync = function (message, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.INFO, message, null, callback);
    };
    /**
     * Log a trace message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.trace = function (message) {
        return this.log(loggerage_level_1.LoggerageLevel.TRACE, message);
    };
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.traceAsync = function (message, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.TRACE, message, null, callback);
    };
    /**
     * Log a success message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.success = function (message) {
        return this.log(loggerage_level_1.LoggerageLevel.SUCCESS, message);
    };
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.successAsync = function (message, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.SUCCESS, message, null, callback);
    };
    /**
     * Log a warn message
     * @param message
     * @returns {Loggerage}
     */
    Loggerage.prototype.warn = function (message) {
        return this.log(loggerage_level_1.LoggerageLevel.WARN, message);
    };
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.warnAsync = function (message, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.WARN, message, null, callback);
    };
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    Loggerage.prototype.error = function (message, stacktrace) {
        return this.log(loggerage_level_1.LoggerageLevel.ERROR, message, stacktrace);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.errorAsync = function (message, stacktrace, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.ERROR, message, stacktrace, callback);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    Loggerage.prototype.failure = function (message, stacktrace) {
        return this.log(loggerage_level_1.LoggerageLevel.FAILURE, message, stacktrace);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.failureAsync = function (message, stacktrace, callback) {
        this.logAsync(loggerage_level_1.LoggerageLevel.FAILURE, message, stacktrace, callback);
    };
    //===========================//
    //      STATIC METHODS       //
    //===========================//
    /**
     * Return a stored logger
     * @param  {string}    app App or logger name
     * @return {Loggerage}
     */
    Loggerage.getLogger = function (app) {
        return Loggerage._loggers[app];
    };
    /**
     * Destroy a stored logger
     * @param {string} app App or logger name
     */
    Loggerage.destroy = function (app) {
        delete Loggerage._loggers[app];
    };
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    Loggerage.prototype._makeLoggerageObject = function (logLevel, message) {
        var logObj = new loggerage_object_1.LoggerageObject(loggerage_level_1.LoggerageLevel[logLevel], message, this._app, this._options.version);
        return logObj;
    };
    /**
     * Store of loggers
     */
    Loggerage._loggers = {};
    return Loggerage;
}());
exports.Loggerage = Loggerage;
utils_1.Utils.applyMixins(Loggerage, [query_1.Queriable, download_1.Downloadable]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOztBQUVyQzs7O0dBR0c7QUFDSCwrQkFBaUM7QUFDakMsc0NBQXdDO0FBRXhDLHVDQUFzQztBQUN0QywrREFBNkQ7QUFDN0QsdUNBQWlEO0FBQ2pELDZDQUFnRDtBQUNoRCx5REFBdUQ7QUFzY25DLDJCQXRjWCxvQ0FBZ0IsQ0FzY1c7QUFyY3BDLHVEQUFxRDtBQXFjZiwwQkFyYzdCLGtDQUFlLENBcWM2QjtBQXBjckQscURBQW1EO0FBb2NJLHlCQXBjOUMsZ0NBQWMsQ0FvYzhDO0FBM2JyRTs7R0FFRztBQUNIO0lBRUUsNEJBQTRCO0lBQzVCLDRCQUE0QjtJQUM1Qiw0QkFBNEI7SUFFNUI7Ozs7T0FJRztJQUNILG1CQUFZLEdBQVUsRUFBRSxPQUF5QjtRQThYakQ7O1dBRUc7UUFDSyxpQkFBWSxHQUFXLEtBQUssQ0FBQztRQWhZbkMsV0FBVztRQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQ0FBZ0IsRUFBRSxDQUFDO1FBRXZDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQztZQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFM0QsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBLENBQUM7WUFDekQsSUFBRyxDQUFDO2dCQUFDLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7b0JBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDL0YsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FB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