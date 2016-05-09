/**
 * LogStorage.js v0.2.1
 * (c) Luis M. Fresneda
 */
"use strict";
var LogStorageObject = (function () {
    function LogStorageObject(level, message) {
        var now = new Date();
        this.date = now.toLocaleString();
        this.level = level;
        this.message = message;
    }
    return LogStorageObject;
}());
var LogStorageLevel;
(function (LogStorageLevel) {
    LogStorageLevel[LogStorageLevel["DEBUG"] = 0] = "DEBUG";
    LogStorageLevel[LogStorageLevel["TRACE"] = 1] = "TRACE";
    LogStorageLevel[LogStorageLevel["SUCCESS"] = 2] = "SUCCESS";
    LogStorageLevel[LogStorageLevel["INFO"] = 3] = "INFO";
    LogStorageLevel[LogStorageLevel["WARN"] = 4] = "WARN";
    LogStorageLevel[LogStorageLevel["ERROR"] = 5] = "ERROR";
    LogStorageLevel[LogStorageLevel["FAILURE"] = 6] = "FAILURE";
})(LogStorageLevel || (LogStorageLevel = {}));
var LogStorage = (function () {
    /**
     * Constructor for LogStorage
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    function LogStorage(app, defaultLogLevel, version) {
        if (defaultLogLevel === void 0) { defaultLogLevel = LogStorageLevel.DEBUG; }
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
     * @returns {LogStorage}
     */
    LogStorage.prototype.setStorage = function (otherStorage) {
        this.__localStorage__ = otherStorage;
        return this;
    };
    /**
     * Return de app version
     * @returns {number}
     */
    LogStorage.prototype.getVersion = function () { return this.__version__; };
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    LogStorage.prototype.getApp = function () { return this.__app__; };
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {LogStorage}
     */
    LogStorage.prototype.setDefaultLogLevel = function (defaultLogLevel) {
        this.__defaultLogLevel__ = defaultLogLevel;
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    LogStorage.prototype.getDefaultLogLevel = function () {
        return LogStorageLevel[this.__defaultLogLevel__];
    };
    /**
     * Get the actual log
     * @returns {Array<LogStorageObject>}
     */
    LogStorage.prototype.getLog = function () {
        var logs = JSON.parse(this.__localStorage__.getItem(this.__app__) || "[]");
        return logs;
    };
    /**
     * Clear all the log
     * @returns {LogStorage}
     */
    LogStorage.prototype.clearLog = function () {
        this.__localStorage__.setItem(this.getApp(), "[]");
        return this;
    };
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {LogStorage}
     */
    LogStorage.prototype.downloadFileLog = function (type) {
        if (type === void 0) { type = "txt"; }
        if (Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            var contenido = "";
            switch (type.toLowerCase()) {
                case "txt":
                    contenido = LogStorage.__buildTxtContent__(this.getLog());
                    break;
                case "csv":
                    contenido = LogStorage.__buildCsvContent__(this.getLog());
                    break;
            }
            var blob = LogStorage.__getBlob__(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            LogStorage.__downloadBlob__(blob, nameFile);
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
     * @returns {LogStorage}
     */
    LogStorage.prototype.log = function (logLevel, message, stacktrace) {
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
     * @returns {LogStorage}
     */
    LogStorage.prototype.info = function (message) {
        return this.log(LogStorageLevel.INFO, message);
    };
    /**
     * Log a debug message
     * @param message
     * @returns {LogStorage}
     */
    LogStorage.prototype.debug = function (message) {
        return this.log(LogStorageLevel.DEBUG, message);
    };
    /**
     * Log a trace message
     * @param message
     * @returns {LogStorage}
     */
    LogStorage.prototype.trace = function (message) {
        return this.log(LogStorageLevel.TRACE, message);
    };
    /**
     * Log a success message
     * @param message
     * @returns {LogStorage}
     */
    LogStorage.prototype.success = function (message) {
        return this.log(LogStorageLevel.SUCCESS, message);
    };
    /**
     * Log a warn message
     * @param message
     * @returns {LogStorage}
     */
    LogStorage.prototype.warn = function (message) {
        return this.log(LogStorageLevel.WARN, message);
    };
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {LogStorage}
     */
    LogStorage.prototype.error = function (message, stacktrace) {
        return this.log(LogStorageLevel.ERROR, message, stacktrace);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {LogStorage}
     */
    LogStorage.prototype.failure = function (message, stacktrace) {
        return this.log(LogStorageLevel.FAILURE, message, stacktrace);
    };
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LogStorageObject}
     */
    LogStorage.prototype.__makeObjectToLog__ = function (logLevel, message) {
        if (logLevel === void 0) { logLevel = this.__defaultLogLevel__; }
        var logObj = new LogStorageObject(LogStorageLevel[logLevel], message);
        return logObj;
    };
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    LogStorage.__buildCsvContent__ = function (ar) {
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
    LogStorage.__buildTxtContent__ = function (ar) {
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
    LogStorage.__getBlob__ = function (content, type) {
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
    LogStorage.__downloadBlob__ = function (blob, nameFile) {
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
    return LogStorage;
}());
exports.LogStorage = LogStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL0xvZ1N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUdIO0lBSUksMEJBQVksS0FBWSxFQUFFLE9BQWM7UUFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQUVELElBQUssZUFRSjtBQVJELFdBQUssZUFBZTtJQUNoQix1REFBSyxDQUFBO0lBQ0wsdURBQUssQ0FBQTtJQUNMLDJEQUFPLENBQUE7SUFDUCxxREFBSSxDQUFBO0lBQ0oscURBQUksQ0FBQTtJQUNKLHVEQUFLLENBQUE7SUFDTCwyREFBTyxDQUFBO0FBQ1gsQ0FBQyxFQVJJLGVBQWUsS0FBZixlQUFlLFFBUW5CO0FBRUQ7SUFDSTs7Ozs7T0FLRztJQUNILG9CQUFZLEdBQVUsRUFBRSxlQUF1RCxFQUFFLE9BQWtCO1FBQTNFLCtCQUF1RCxHQUF2RCxrQkFBa0MsZUFBZSxDQUFDLEtBQUs7UUFBRSx1QkFBa0IsR0FBbEIsV0FBa0I7UUFDL0YsSUFBSSxDQUFDO1lBQ0QsRUFBRSxDQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQztnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUNoRCxDQUFFO1FBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULEVBQUUsQ0FBQSxDQUFD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