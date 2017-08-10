"use strict";
/// <reference types="es6-promise" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var loggerage_options_1 = require("./loggerage-options");
exports.LoggerageOptions = loggerage_options_1.LoggerageOptions;
var loggerage_object_1 = require("./loggerage-object");
exports.LoggerageObject = loggerage_object_1.LoggerageObject;
var loggerage_level_1 = require("./loggerage-level");
exports.LoggerageLevel = loggerage_level_1.LoggerageLevel;
/**
 * Loggerage class
 */
var Loggerage = (function (_super) {
    __extends(Loggerage, _super);
    //========================//
    //      CONSTRUCTOR       //
    //========================//
    /**
     * Constructor for Loggerage
     * @param app    App or Logger name
     * @param rest   Optional parameters
     */
    function Loggerage(app, options) {
        var _this = _super.call(this) || this;
        /**
         * Indicate if localStorage is ok (false by default)
         */
        _this._isStorageOk = false;
        _this._options = new loggerage_options_1.LoggerageOptions();
        if (options)
            _this._options = assign(_this._options, options);
        if (!_this._options.storage && _this._options.isLocalStorage) {
            try {
                if (window.localStorage)
                    _this._options.storage = new wrap_localstorage_1.WrapLocalStorage(window.localStorage);
            }
            catch (e) {
                if (e.message !== 'window is not defined')
                    throw e;
                try {
                    if (global.localStorage)
                        _this._options.storage = new wrap_localstorage_1.WrapLocalStorage(global.localStorage);
                }
                catch (e) {
                    if (e.message !== 'global is not defined')
                        throw e;
                }
            }
        }
        if (_this._options.storage) {
            _this._isStorageOk = true;
        }
        else if (!_this._options.silence) {
            console.warn(colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
        }
        _this._app = app;
        Loggerage._loggers[_this._app] = _this;
        _this.resetQuery();
        return _this;
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
                    contenido = utils_1.Utils.buildTxtContent(this.getLog());
                    break;
                case "csv":
                    contenido = utils_1.Utils.buildCsvContent(this.getLog());
                    break;
            }
            var blob = utils_1.Utils.getBlob(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            utils_1.Utils.downloadBlob(blob, nameFile);
        }
        else {
            throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        }
        this.resetQuery();
        return this;
    };
    /**
     * Download the log in a file
     * @param type     File type (csv || txt) txt by default
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
     * @returns {void}
     */
    Loggerage.prototype.downloadFileLogAsync = function (type, callback) {
        var _this = this;
        if (type === void 0) { type = "txt"; }
        if (Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            var contenido_1 = "";
            this.getLogAsync(function (err, logs) {
                if (err)
                    return callback(err);
                switch (type.toLowerCase()) {
                    case "txt":
                        contenido_1 = utils_1.Utils.buildTxtContent(logs);
                        break;
                    case "csv":
                        contenido_1 = utils_1.Utils.buildCsvContent(logs);
                        break;
                }
                var blob = utils_1.Utils.getBlob(contenido_1, type);
                var nameFile = _this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
                utils_1.Utils.downloadBlob(blob, nameFile);
                _this.resetQuery();
                callback(null, blob);
            });
        }
        else {
            this.resetQuery();
            callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
        }
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
}(query_1.Queriable));
exports.Loggerage = Loggerage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOzs7Ozs7Ozs7Ozs7QUFFckM7OztHQUdHO0FBQ0gsK0JBQWlDO0FBQ2pDLHNDQUF3QztBQUV4Qyx1Q0FBc0M7QUFDdEMsK0RBQTZEO0FBQzdELHVDQUEwQztBQUMxQyx5REFBdUQ7QUE0ZW5DLDJCQTVlWCxvQ0FBZ0IsQ0E0ZVc7QUEzZXBDLHVEQUFxRDtBQTJlZiwwQkEzZTdCLGtDQUFlLENBMmU2QjtBQTFlckQscURBQW1EO0FBMGVJLHlCQTFlOUMsZ0NBQWMsQ0EwZThDO0FBamVyRTs7R0FFRztBQUNIO0lBQXdCLDZCQUFTO0lBRS9CLDRCQUE0QjtJQUM1Qiw0QkFBNEI7SUFDNUIsNEJBQTRCO0lBRTVCOzs7O09BSUc7SUFDSCxtQkFBWSxHQUFVLEVBQUUsT0FBeUI7UUFBakQsWUFDRSxpQkFBTyxTQXVCUjtRQWthRDs7V0FFRztRQUNLLGtCQUFZLEdBQVcsS0FBSyxDQUFDO1FBM2JuQyxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksb0NBQWdCLEVBQUUsQ0FBQztRQUV2QyxFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUM7WUFBQyxLQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FBQSxDQUFDLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQSxDQUFDO1lBQ3pELElBQUcsQ0FBQztnQkFBQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO29CQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksb0NBQWdCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9GLENBQUM7WUFBQyxL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