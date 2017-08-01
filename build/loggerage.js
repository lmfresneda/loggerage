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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOztBQUVIO0lBQ0k7Ozs7O09BS0c7SUFDSCxtQkFBWSxHQUFVLEVBQUUsZUFBcUQsRUFBRSxPQUFrQjtRQUF6RSxnQ0FBQSxFQUFBLGtCQUFpQyxjQUFjLENBQUMsS0FBSztRQUFFLHdCQUFBLEVBQUEsV0FBa0I7UUFDN0YsSUFBSSxDQUFDO1lBQ0QsRUFBRSxDQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQztnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUNoRCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksc0NBQXNDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsZUFBZSxDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsOEJBQVUsR0FBVixVQUFXLFlBQWdCO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsOEJBQVUsR0FBVixjQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFaEQ7OztPQUdHO0lBQ0gsMEJBQU0sR0FBTixjQUFrQixNQUFNLENB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