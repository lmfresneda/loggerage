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
        this.__isStorage__ = false;
        try {
            if (window.localStorage) {
                this.__localStorage__ = window.localStorage;
                this.__isStorage__ = true;
            }
            else {
                console.warn('localStorage not found. Remember set your Storage by \'.setStorage() method\'');
            }
        }
        catch (e) {
            if (e.message !== 'window is not defined') {
                throw e;
            }
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
        this.__isStorage__ = true;
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
        if (!this.__isStorage__) {
            throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');
        }
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
    Loggerage.__buildCsvContent__ = function (arr) {
        var contenido = '';
        if (!arr.length)
            return contenido;
        contenido += Object.keys(arr[0]).join(';') + '\n';
        arr.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) { return obj[key]; }).join(';') + '\n';
        });
        return contenido;
    };
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    Loggerage.__buildTxtContent__ = function (arr) {
        var contenido = '';
        if (!arr.length)
            return contenido;
        contenido += Object.keys(arr[0]).join('\t') + '\n';
        arr.forEach(function (obj) {
            contenido += Object.keys(obj).map(function (key) { return obj[key]; }).join('\t') + '\n';
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
        var ts = Date.now();
        var now = new Date(ts);
        this.timestamp = ts;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOztBQUVIO0lBQ0k7Ozs7O09BS0c7SUFDSCxtQkFBWSxHQUFVLEVBQUUsZUFBcUQsRUFBRSxPQUFrQjtRQUF6RSxnQ0FBQSxFQUFBLGtCQUFpQyxjQUFjLENBQUMsS0FBSztRQUFFLHdCQUFBLEVBQUEsV0FBa0I7UUFDN0YsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBRyxDQUFDO1lBQ0EsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO2dCQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUM5QixDQUFDO1lBQUEsSUFBSSxDQUFBLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO1lBQ2xHLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssdUJBQXVCLENBQUMsQ0FBQSxDQUFDO2dCQUN0QyxNQUFNLENBQUMsQ0FBQztZQUNaLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGVBQWUsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDhCQUFVLEdBQVYsVUFBVyxZQUFnQjtRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFD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