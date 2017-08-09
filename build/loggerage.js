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
    function Loggerage(app) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        /**
         * Indicate if localStorage is ok (false by default)
         */
        this._isStorageOk = false;
        var options = new loggerage_options_1.LoggerageOptions();
        if (rest.length && typeof rest[0] === 'object') {
            options = assign(options, rest[0]);
        }
        else if (rest.length) {
            console.warn(colors.yellow('WARN: Remember, the old constructor is deprecated. See [https://github.com/lmfresneda/loggerage#new-constructor] for more details'));
            options.defaultLogLevel = rest[0];
            options.version = rest[1] || 1;
        }
        var storage = options.storage;
        if (!storage && options.isLocalStorage) {
            try {
                if (window.localStorage)
                    storage = new wrap_localstorage_1.WrapLocalStorage(window.localStorage);
            }
            catch (e) {
                if (e.message !== 'window is not defined')
                    throw e;
                try {
                    if (global.localStorage)
                        storage = new wrap_localstorage_1.WrapLocalStorage(global.localStorage);
                }
                catch (e) {
                    if (e.message !== 'global is not defined')
                        throw e;
                }
            }
        }
        if (storage) {
            this._storage = storage;
            this._isStorageOk = true;
        }
        else if (!options.silence) {
            console.warn(colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
        }
        this._silence = options.silence;
        this._app = app;
        this._version = options.version;
        this._defaultLogLevel = options.defaultLogLevel;
    }
    /**
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    Loggerage.prototype.setStorage = function (storage) {
        this._storage = storage;
        this._isStorageOk = true;
        return this;
    };
    /**
     * Return the app version
     * @returns {number}
     */
    Loggerage.prototype.getVersion = function () { return this._version; };
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
        this._defaultLogLevel = defaultLogLevel;
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    Loggerage.prototype.getDefaultLogLevel = function () {
        return loggerage_level_1.LoggerageLevel[this._defaultLogLevel];
    };
    /**
     * Get the default log level number
     * @returns {number}
     */
    Loggerage.prototype.getDefaultLogLevelNumber = function () {
        return this._defaultLogLevel;
    };
    /**
     * Set the silence property
     * @param silence
     * @returns {Loggerage}
     */
    Loggerage.prototype.setSilence = function (silence) {
        this._silence = silence;
        return this;
    };
    /**
     * Get the silence property
     * @returns {boolean}
     */
    Loggerage.prototype.getSilence = function () {
        return this._silence;
    };
    /**
     * Get the actual log
     * @returns {LoggerageObject[]}
     */
    Loggerage.prototype.getLog = function () {
        var logs = this._storage.getItem(this._app);
        return logs;
    };
    /**
     * Get the actual log asynchronously
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
     * @returns {void}
     */
    Loggerage.prototype.getLogAsync = function (callback) {
        Promise.resolve(this._storage.getItem(this._app)).then(function (data) {
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
        this._storage.clear();
        return this;
    };
    /**
     * Clear all the log asynchronously
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    Loggerage.prototype.clearLogAsync = function (callback) {
        Promise.resolve(this._storage.clear()).then(callback).catch(callback);
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
        if (logLevel === void 0) { logLevel = this._defaultLogLevel; }
        if (!this._isStorageOk) {
            throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');
        }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this._makeLoggerageObject(logLevel, message);
        this._storage.setItem(this._app, logObj);
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
        if (logLevel === void 0) { logLevel = this._defaultLogLevel; }
        if (!this._isStorageOk) {
            return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
        }
        if (stacktrace) {
            message += "\n[Stack Trace: " + stacktrace + "]";
        }
        var logObj = this._makeLoggerageObject(logLevel, message);
        Promise.resolve(this._storage.setItem(this._app, logObj)).then(callback).catch(callback);
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
        if (logLevel === void 0) { logLevel = this._defaultLogLevel; }
        var logObj = new loggerage_object_1.LoggerageObject(loggerage_level_1.LoggerageLevel[logLevel], message, this._app, this._version);
        return logObj;
    };
    return Loggerage;
}());
exports.Loggerage = Loggerage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOztBQUVyQzs7O0dBR0c7QUFDSCwrQkFBaUM7QUFDakMsc0NBQXdDO0FBQ3hDLHVDQUFzQztBQUN0QywrREFBNkQ7QUFDN0QseURBQXVEO0FBd2FuQywyQkF4YVgsb0NBQWdCLENBd2FXO0FBdmFwQyx1REFBcUQ7QUF1YWYsMEJBdmE3QixrQ0FBZSxDQXVhNkI7QUF0YXJELHFEQUFtRDtBQXNhSSx5QkF0YTlDLGdDQUFjLENBc2E4QztBQTVackU7O0dBRUc7QUFDSDtJQUNFOzs7O09BSUc7SUFDSCxtQkFBWSxHQUFVO1FBQUUsY0FBYTthQUFiLFVBQWEsRUFBYixxQkFBYSxFQUFiLElBQWE7WUFBYiw2QkFBYTs7UUFpWXJDOztXQUVHO1FBQ0ssaUJBQVksR0FBVyxLQUFLLENBQUM7UUFuWW5DLElBQUksT0FBTyxHQUFHLElBQUksb0NBQWdCLEVBQUUsQ0FBQztRQUVyQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFBLENBQUM7WUFDN0MsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUFBLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQztZQUNwQixPQUFPLENBQUMsSUFBSSxDQUNWLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUlBQW1JLENBQUMsQ0FBQyxDQUFDO1lBQ3RKLE9BQU8sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztR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