"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("colors");
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
                console.warn(colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
            }
        }
        catch (e) {
            if (e.message !== 'window is not defined')
                throw e;
            try {
                if (global.localStorage) {
                    this.__localStorage__ = global.localStorage;
                    this.__isStorage__ = true;
                }
                else {
                    console.warn(colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
                }
            }
            catch (e) {
                if (e.message !== 'global is not defined')
                    throw e;
            }
        }
        this.__app__ = app;
        this.__version__ = version;
        this.__defaultLogLevel__ = defaultLogLevel;
    }
    /**
     * Set your own Storage
     * @param otherStorage
     * @returns {Loggerage}
     */
    Loggerage.prototype.setStorage = function (otherStorage) {
        this.__localStorage__ = otherStorage;
        this.__isStorage__ = true;
        return this;
    };
    /**
     * Return the app version
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
                    contenido = Utils.__buildTxtContent__(this.getLog());
                    break;
                case "csv":
                    contenido = Utils.__buildCsvContent__(this.getLog());
                    break;
            }
            var blob = Utils.__getBlob__(contenido, type);
            var nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            Utils.__downloadBlob__(blob, nameFile);
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
var Utils = (function () {
    function Utils() {
    }
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     */
    Utils.__buildCsvContent__ = function (arr) {
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
     */
    Utils.__buildTxtContent__ = function (arr) {
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
     */
    Utils.__getBlob__ = function (content, type) {
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
     */
    Utils.__downloadBlob__ = function (blob, nameFile) {
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
    return Utils;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQVNqQztJQUNJOzs7OztPQUtHO0lBQ0gsbUJBQVksR0FBVSxFQUFFLGVBQXFELEVBQUUsT0FBa0I7UUFBekUsZ0NBQUEsRUFBQSxrQkFBaUMsY0FBYyxDQUFDLEtBQUs7UUFBRSx3QkFBQSxFQUFBLFdBQWtCO1FBQzdGLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUcsQ0FBQztZQUNBLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQSxDQUFDO2dCQUNwQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDOUIsQ0FBQztZQUFBLElBQUksQ0FBQSxDQUFDO2dCQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDLENBQUM7WUFBQyxDQUFDO1FBQ2hILENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQztnQkFBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxJQUFHLENBQUM7Z0JBQ0EsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO29CQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztnQkFDOUIsQ0FBQztnQkFBQSxJQUFJLENBQUEsQ0FBQztvQkFBQyxPQUFPLENBQUMsSUFBSSxDQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMscUZBQXFGLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUM7WUFDaEgsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQztvQkFBQyxNQUFNLENBQUMsQ0FBQztZQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1FBQzNCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCw4QkFBVSxHQUFWLFVBQVcsWUFBZ0I7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFlBQVksQ0FBQztRQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCw4QkFBVSxHQUFWLGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUVoRDs7O09BR0c7SUFDSCwwQkFBTSxHQUFOLGNBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUV4Qzs7OztPQUlHO0lBQ0gsc0NBQWtCLEdBQWxCLFVBQW1CLGVBQThCO1FBQzdDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsc0NBQWtCLEdBQWxCO1FBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMEJBQU0sR0FBTjtRQUNJLElBQUksSUFBSSxHQUEwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2xHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDRCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsbUNBQWUsR0FBZixVQUFnQixJQUFtQjtRQUFuQixxQkFBQSxFQUFBLFlBQW1CO1FBQy9CLEVBQUUsQ0FBQSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN6QyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekIsS0FBSyxLQUFLO29CQUNOLFNBQVMsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQ3JELEtBQUssQ0FBQztnQkFDVixLQUFLLEtBQUs7b0JBQ04sU0FBUyxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDckQsS0FBSyxDQUFDO1lBQ2QsQ0FBQztZQUNELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0UsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQUEsSUFBSSxDQUFDLENBQUM7WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLGlIQUFpSCxDQUFDLENBQUM7UUFDdkksQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILHVCQUFHLEdBQUgsVUFBSSxRQUFrRCxFQUFFLE9BQWMsRUFBRSxVQUFrQjtRQUF0Rix5QkFBQSxFQUFBLFdBQTBCLElBQUksQ0FBQyxtQkFBbUI7UUFDbEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUEsQ0FBQztZQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLFVBQVUsQ0FBQyxDQUFBLENBQUM7WUFDWCxPQUFPLElBQUkscUJBQW1CLFVBQVUsTUFBRyxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFNLE1BQU0sR0FBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRSxJQUFNLElBQUksR0FBMEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsd0JBQUksR0FBSixVQUFLLE9BQWM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRDs7OztPQUlHO0lBQ0gseUJBQUssR0FBTCxVQUFNLE9BQWM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNILHlCQUFLLEdBQUwsVUFBTSxPQUFjO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCwyQkFBTyxHQUFQLFVBQVEsT0FBYztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsd0JBQUksR0FBSixVQUFLLE9BQWM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRDs7Ozs7T0FLRztJQUNILHlCQUFLLEdBQUwsVUFBTSxPQUFjLEVBQUUsVUFBaUI7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0gsMkJBQU8sR0FBUCxVQUFRLE9BQWMsRUFBRSxVQUFpQjtRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBd0JEOzs7Ozs7T0FNRztJQUNLLHVDQUFtQixHQUEzQixVQUE0QixRQUFrRCxFQUFFLE9BQWM7UUFBbEUseUJBQUEsRUFBQSxXQUEwQixJQUFJLENBQUMsbUJBQW1CO1FBQzFFLElBQUksTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFSixnQkFBQztBQUFELENBQUMsQUF2T0YsSUF1T0U7QUF2T1csOEJBQVM7QUEyT3RCO0lBS0kseUJBQVksS0FBWSxFQUFFLE9BQWM7UUFDcEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksMENBQWU7QUFlNUIsSUFBWSxjQVFYO0FBUkQsV0FBWSxjQUFjO0lBQ3RCLHFEQUFLLENBQUE7SUFDTCxxREFBSyxDQUFBO0lBQ0wseURBQU8sQ0FBQTtJQUNQLG1EQUFJLENBQUE7SUFDSixtREFBSSxDQUFBO0lBQ0oscURBQUssQ0FBQTtJQUNMLHlEQUFPLENBQUE7QUFDWCxDQUFDLEVBUlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFRekI7QUFFRDtJQUFBO0lBMkVBLENBQUM7SUExRUc7Ozs7T0FJRztJQUNJLHlCQUFtQixHQUExQixVQUEyQixHQUFjO1FBQ3JDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNuQixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2pDLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDbEQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7WUFDWixTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQVIsQ0FBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4RSxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSx5QkFBbUIsR0FBMUIsVUFBMkIsR0FBYztRQUNyQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ1osU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFSLENBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNJLGlCQUFXLEdBQWxCLFVBQW1CLE9BQWMsRUFBRSxJQUFtQjtRQUFuQixxQkFBQSxFQUFBLFlBQW1CO1FBQ2xELElBQUksSUFBUyxDQUFDO1FBQ2QsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBLENBQUM7WUFDeEIsS0FBSyxLQUFLO2dCQUFFLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQzFCLEtBQUssQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksc0JBQWdCLEdBQXZCLFVBQXdCLElBQVMsRUFBRSxRQUFlO1FBQzlDLDZGQUE2RjtRQUM3RixJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxDQUFDO1FBQ1QsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLEtBQUs7WUFDM0IsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksU0FBUyxDQUFDO1lBQ2QsSUFBSSxDQUFDO2dCQUNELFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7b0JBQ2hDLE1BQU0sRUFBRSxNQUFNO29CQUNkLFNBQVMsRUFBRSxJQUFJO29CQUNmLFlBQVksRUFBRSxJQUFJO2lCQUNyQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVCxTQUFTLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDL0MsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQUFDLEFBM0VELElBMkVDIn0=