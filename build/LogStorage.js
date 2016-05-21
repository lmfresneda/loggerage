/**
 * LogStorageJS.js v0.2.2
 * (c) Luis M. Fresneda
 */
"use strict";
var LogStorageJSObject = (function () {
    function LogStorageJSObject(level, message) {
        var now = new Date();
        this.date = now.toLocaleString();
        this.level = level;
        this.message = message;
    }
    return LogStorageJSObject;
}());
var LogStorageJSLevel;
(function (LogStorageJSLevel) {
    LogStorageJSLevel[LogStorageJSLevel["DEBUG"] = 0] = "DEBUG";
    LogStorageJSLevel[LogStorageJSLevel["TRACE"] = 1] = "TRACE";
    LogStorageJSLevel[LogStorageJSLevel["SUCCESS"] = 2] = "SUCCESS";
    LogStorageJSLevel[LogStorageJSLevel["INFO"] = 3] = "INFO";
    LogStorageJSLevel[LogStorageJSLevel["WARN"] = 4] = "WARN";
    LogStorageJSLevel[LogStorageJSLevel["ERROR"] = 5] = "ERROR";
    LogStorageJSLevel[LogStorageJSLevel["FAILURE"] = 6] = "FAILURE";
})(LogStorageJSLevel || (LogStorageJSLevel = {}));
var LogStorageJS = (function () {
    /**
     * Constructor for LogStorageJS
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    function LogStorageJS(app, defaultLogLevel, version) {
        if (defaultLogLevel === void 0) { defaultLogLevel = LogStorageJSLevel.DEBUG; }
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
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.setStorage = function (otherStorage) {
        this.__localStorage__ = otherStorage;
        return this;
    };
    /**
     * Return de app version
     * @returns {number}
     */
    LogStorageJS.prototype.getVersion = function () { return this.__version__; };
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    LogStorageJS.prototype.getApp = function () { return this.__app__; };
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.setDefaultLogLevel = function (defaultLogLevel) {
        this.__defaultLogLevel__ = defaultLogLevel;
        return this;
    };
    /**
     * Get the default log level
     * @returns {string}
     */
    LogStorageJS.prototype.getDefaultLogLevel = function () {
        return LogStorageJSLevel[this.__defaultLogLevel__];
    };
    /**
     * Get the actual log
     * @returns {Array<LogStorageJSObject>}
     */
    LogStorageJS.prototype.getLog = function () {
        var logs = JSON.parse(this.__localStorage__.getItem(this.__app__) || "[]");
        return logs;
    };
    /**
     * Clear all the log
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.clearLog = function () {
        this.__localStorage__.setItem(this.getApp(), "[]");
        return this;
    };
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.downloadFileLog = function (type) {
        if (type === void 0) { type = "txt"; }
        if (Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            var contenido = "";
            switch (type.toLowerCase()) {
                case "txt":
                    contenido = LogStorageJS.__buildTxtContent__(this.getLog());
                    break;
                case "csv":
                    contenido = LogStorageJS.__buildCsvContent__(this.getLog());
                    break;
            }
            var blob = LogStorageJS.__getBlob__(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            LogStorageJS.__downloadBlob__(blob, nameFile);
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
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.log = function (logLevel, message, stacktrace) {
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
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.info = function (message) {
        return this.log(LogStorageJSLevel.INFO, message);
    };
    /**
     * Log a debug message
     * @param message
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.debug = function (message) {
        return this.log(LogStorageJSLevel.DEBUG, message);
    };
    /**
     * Log a trace message
     * @param message
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.trace = function (message) {
        return this.log(LogStorageJSLevel.TRACE, message);
    };
    /**
     * Log a success message
     * @param message
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.success = function (message) {
        return this.log(LogStorageJSLevel.SUCCESS, message);
    };
    /**
     * Log a warn message
     * @param message
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.warn = function (message) {
        return this.log(LogStorageJSLevel.WARN, message);
    };
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.error = function (message, stacktrace) {
        return this.log(LogStorageJSLevel.ERROR, message, stacktrace);
    };
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    LogStorageJS.prototype.failure = function (message, stacktrace) {
        return this.log(LogStorageJSLevel.FAILURE, message, stacktrace);
    };
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LogStorageJSObject}
     */
    LogStorageJS.prototype.__makeObjectToLog__ = function (logLevel, message) {
        if (logLevel === void 0) { logLevel = this.__defaultLogLevel__; }
        var logObj = new LogStorageJSObject(LogStorageJSLevel[logLevel], message);
        return logObj;
    };
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    LogStorageJS.__buildCsvContent__ = function (ar) {
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
    LogStorageJS.__buildTxtContent__ = function (ar) {
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
    LogStorageJS.__getBlob__ = function (content, type) {
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
    LogStorageJS.__downloadBlob__ = function (blob, nameFile) {
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
    return LogStorageJS;
}());
exports.LogStorageJS = LogStorageJS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL0xvZ1N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUdIO0lBSUksNEJBQVksS0FBWSxFQUFFLE9BQWM7UUFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQUVELElBQUssaUJBUUo7QUFSRCxXQUFLLGlCQUFpQjtJQUNsQiwyREFBSyxDQUFBO0lBQ0wsMkRBQUssQ0FBQTtJQUNMLCtEQUFPLENBQUE7SUFDUCx5REFBSSxDQUFBO0lBQ0oseURBQUksQ0FBQTtJQUNKLDJEQUFLLENBQUE7SUFDTCwrREFBTyxDQUFBO0FBQ1gsQ0FBQyxFQVJJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFRckI7QUFFRDtJQUNJOzs7OztPQUtHO0lBQ0gsc0JBQVksR0FBVSxFQUFFLGVBQTJELEVBQUUsT0FBa0I7UUFBL0UsK0JBQTJELEdBQTNELGtCQUFvQyxpQkFBaUIsQ0FBQyxLQUFLO1FBQUUsdUJBQWtCLEdBQWxCLFdBQWtCO1FBQ25HLElBQUksQ0FBQztZQUNELEVBQUUsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBLENBQUM7Z0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDaEQsQ0FBRTtRQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxFQUFF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