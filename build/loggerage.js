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
    }
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
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    Loggerage.prototype.setStorage = function (storage) {
        this._options.storage = storage;
        this._isStorageOk = true;
        return this;
    };
    /**
     * Return the app version
     * @returns {number}
     */
    Loggerage.prototype.getVersion = function () { return this._options.version; };
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    Loggerage.prototype.getApp = function () { return this._app; };
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {Loggerage}
     */
    Loggerage.prototype.setDefaultLogLevel = function (defaultLogLevel) {
        this._options.defaultLogLevel = defaultLogLevel;
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    Loggerage.prototype.getDefaultLogLevel = function () {
        return loggerage_level_1.LoggerageLevel[this._options.defaultLogLevel];
    };
    /**
     * Get the default log level number
     * @returns {number}
     */
    Loggerage.prototype.getDefaultLogLevelNumber = function () {
        return this._options.defaultLogLevel;
    };
    /**
     * Set the silence property
     * @param silence
     * @returns {Loggerage}
     */
    Loggerage.prototype.setSilence = function (silence) {
        this._options.silence = silence;
        return this;
    };
    /**
     * Get the silence property
     * @returns {boolean}
     */
    Loggerage.prototype.getSilence = function () {
        return this._options.silence;
    };
    /**
     * Get the actual log
     * @returns {LoggerageObject[]}
     */
    Loggerage.prototype.getLog = function () {
        var logs = this._options.storage.getItem(this._app);
        return logs;
    };
    /**
     * Get the actual log asynchronously
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
     * @returns {void}
     */
    Loggerage.prototype.getLogAsync = function (callback) {
        Promise.resolve(this._options.storage.getItem(this._app)).then(function (data) {
            var logs = data;
            callback(null, data);
        }).catch(function (err) {
            callback(err);
        });
    };
    /**
     * Clear all the log
     * @returns {Loggerage}
     */
    Loggerage.prototype.clearLog = function () {
        this._options.storage.clear();
        return this;
    };
    /**
     * Clear all the log asynchronously
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.clearLogAsync = function (callback) {
        Promise.resolve(this._options.storage.clear()).then(callback).catch(callback);
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
                callback(null, blob);
            });
        }
        else {
            callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
        }
    };
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
        if (logLevel === void 0) { logLevel = this._options.defaultLogLevel; }
        if (!this._isStorageOk) {
            return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
        }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this._makeLoggerageObject(logLevel, message);
        Promise.resolve(this._options.storage.setItem(this._app, logObj)).then(callback).catch(callback);
    };
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
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    Loggerage.prototype._makeLoggerageObject = function (logLevel, message) {
        if (logLevel === void 0) { logLevel = this._options.defaultLogLevel; }
        var logObj = new loggerage_object_1.LoggerageObject(loggerage_level_1.LoggerageLevel[logLevel], message, this._app, this._options.version);
        return logObj;
    };
    Loggerage._loggers = {};
    return Loggerage;
}());
exports.Loggerage = Loggerage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOztBQUVyQzs7O0dBR0c7QUFDSCwrQkFBaUM7QUFDakMsc0NBQXdDO0FBQ3hDLHVDQUFzQztBQUN0QywrREFBNkQ7QUFDN0QseURBQXVEO0FBa2FuQywyQkFsYVgsb0NBQWdCLENBa2FXO0FBamFwQyx1REFBcUQ7QUFpYWYsMEJBamE3QixrQ0FBZSxDQWlhNkI7QUFoYXJELHFEQUFtRDtBQWdhSSx5QkFoYTlDLGdDQUFjLENBZ2E4QztBQXRackU7O0dBRUc7QUFDSDtJQWdCRTs7OztPQUlHO0lBQ0gsbUJBQVksR0FBVSxFQUFFLE9BQXlCO1FBMFdqRDs7V0FFRztRQUNLLGlCQUFZLEdBQVcsS0FBSyxDQUFDO1FBNVduQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksb0NBQWdCLEVBQUUsQ0FBQztRQUV2QyxFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQSxDQUFDO1lBQ3pELElBQUcsQ0FBQztnQkFBQyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO29CQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksb0NBQWdCLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQy9GLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssdUJBQXVCLENBQUM7b0JBQUMsTUFB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