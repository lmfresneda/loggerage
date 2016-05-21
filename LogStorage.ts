/**
 * LogStorageJS.js v0.2.2
 * (c) Luis M. Fresneda
 */


class LogStorageJSObject {
    date:string;
    level:string;
    message:string;
    constructor(level:string, message:string){
        let now = new Date();
        this.date = now.toLocaleString();
        this.level = level;
        this.message = message;
    }
}

enum LogStorageJSLevel {
    DEBUG,
    TRACE,
    SUCCESS, 
    INFO,
    WARN,
    ERROR,
    FAILURE
}

export class LogStorageJS {
    /**
     * Constructor for LogStorageJS
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    constructor(app:string, defaultLogLevel:LogStorageJSLevel = LogStorageJSLevel.DEBUG, version:number = 1){
        try {
            if(!window.localStorage){
                throw new Error(`[localStorage] not exist in your app`);
            }
            this.__localStorage__ = window.localStorage;
        } catch (e) {
            if(e.message == `[localStorage] not exist in your app`)
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
    setStorage(otherStorage:any):LogStorageJS {
        this.__localStorage__ = otherStorage;
        return this;
    }

    /**
     * Return de app version
     * @returns {number}
     */
    getVersion():number { return this.__version__; }

    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    getApp():string { return this.__app__; }

    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {LogStorageJS}
     */
    setDefaultLogLevel(defaultLogLevel:LogStorageJSLevel):LogStorageJS {
        this.__defaultLogLevel__ = defaultLogLevel;
        return this;
    }

    /**
     * Get the default log level
     * @returns {string}
     */
    getDefaultLogLevel():string {
        return LogStorageJSLevel[this.__defaultLogLevel__];
    }

    /**
     * Get the actual log
     * @returns {Array<LogStorageJSObject>}
     */
    getLog():Array<LogStorageJSObject>{
        let logs:Array<LogStorageJSObject> = JSON.parse(this.__localStorage__.getItem(this.__app__) || "[]");
        return logs;
    }

    /**
     * Clear all the log
     * @returns {LogStorageJS}
     */
    clearLog():LogStorageJS {
        this.__localStorage__.setItem(this.getApp(), "[]");
        return this;
    }

    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {LogStorageJS}
     */
    downloadFileLog(type:string = "txt"):LogStorageJS{
        if(Blob && (window.URL || window["webkitURL"])) {
            console.info("The file is building now");
            let contenido = "";
            switch (type.toLowerCase()) {
                case "txt":
                    contenido = LogStorageJS.__buildTxtContent__(this.getLog());
                    break;
                case "csv":
                    contenido = LogStorageJS.__buildCsvContent__(this.getLog());
                    break;
            }
            let blob = LogStorageJS.__getBlob__(contenido, type);
            let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
            LogStorageJS.__downloadBlob__(blob, nameFile);
        }else {
            throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
        }
        return this;
    }

    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {LogStorageJS}
     */
    log(logLevel:LogStorageJSLevel = this.__defaultLogLevel__, message:string, stacktrace?:string):LogStorageJS {
        if(stacktrace){
            message += `\n[Stack Trace: ${stacktrace}]`;
        }
        let logObj:LogStorageJSObject = this.__makeObjectToLog__(logLevel, message);
        let logs:Array<LogStorageJSObject> = this.getLog();
        logs.push(logObj);
        this.__localStorage__.setItem(this.__app__, JSON.stringify(logs));
        return this;
    }

    /**
     * Log an info message
     * @param message
     * @returns {LogStorageJS}
     */
    info(message:string):LogStorageJS {
        return this.log(LogStorageJSLevel.INFO, message);
    }
    /**
     * Log a debug message
     * @param message
     * @returns {LogStorageJS}
     */
    debug(message:string):LogStorageJS {
        return this.log(LogStorageJSLevel.DEBUG, message);
    }
    /**
     * Log a trace message
     * @param message
     * @returns {LogStorageJS}
     */
    trace(message:string):LogStorageJS {
        return this.log(LogStorageJSLevel.TRACE, message);
    }
    /**
     * Log a success message
     * @param message
     * @returns {LogStorageJS}
     */
    success(message:string):LogStorageJS {
        return this.log(LogStorageJSLevel.SUCCESS, message);
    }
    /**
     * Log a warn message
     * @param message
     * @returns {LogStorageJS}
     */
    warn(message:string):LogStorageJS {
        return this.log(LogStorageJSLevel.WARN, message);
    }
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    error(message:string, stacktrace:string):LogStorageJS {
        return this.log(LogStorageJSLevel.ERROR, message, stacktrace);
    }
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    failure(message:string, stacktrace:string):LogStorageJS {
        return this.log(LogStorageJSLevel.FAILURE, message, stacktrace);
    }

    //                           //
    //      PRIVATE METHODS      //
    //                           //

    private __localStorage__:any;
    /**
     * App name for localStorage
     */
    private __app__:string;
    /**
     * Version number for this app log
     */
    private __version__:number;
    /**
     * Default log level
     */
    private __defaultLogLevel__:LogStorageJSLevel;
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LogStorageJSObject}
     */
    private __makeObjectToLog__(logLevel:LogStorageJSLevel = this.__defaultLogLevel__, message:string):LogStorageJSObject {
        let logObj = new LogStorageJSObject(LogStorageJSLevel[logLevel], message);
        return logObj;
    }
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    private static __buildCsvContent__(ar:Array<any>):string {
        let contenido = "";
        if(!ar.length) return contenido;
        contenido += Object.keys(ar[0]).join(";") + "\n";
        ar.forEach((obj) => {
            contenido += Object.keys(obj).map((key) => {
                    return obj[key];
                }).join(";") + "\n";
        });
        return contenido;
    }
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    private static __buildTxtContent__(ar:Array<any>):string {
        let contenido = "";
        if(!ar.length) return contenido;
        ar.forEach((obj) => {
            contenido += Object.keys(obj).map((key) => {
                    return obj[key];
                }).join("\t") + "\n";
        });
        return contenido;
    }
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     * @private
     */
    private static __getBlob__(content:string, type:string = "txt"):Blob {
        let blob:Blob;
        let mime = 'text/plain';
        switch (type.toLowerCase()){
            case "csv": mime = 'text/csv';
                break;
        }
        blob = new Blob(["\ufeff", content], {type: mime});
        return blob;
    }
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     * @private
     */
    private static __downloadBlob__(blob:Blob, nameFile:string):void {
        //[http://lmfresneda.esy.es/javascript/crear-archivo-csv-con-array-de-objecto-en-javascript/]
        let reader = new FileReader();
        let save;
        reader.onload = function (event) {
            save = document.createElement('a');
            save.href = event.target["result"];
            save.target = '_blank';
            save.download = nameFile;
            let clicEvent;
            try {
                clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
            } catch (e) {
                clicEvent = document.createEvent("MouseEvent");
                clicEvent.initEvent('click', true, true);
            }
            save.dispatchEvent(clicEvent);
            (window.URL || window["webkitURL"]).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(blob);
    }
 }
