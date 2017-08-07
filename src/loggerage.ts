import * as colors from 'colors';

/**
 * loggerage.js v1.0.0
 * (c) lmfresneda <https://github.com/lmfresneda/loggerage>
 */

declare var global: any;

export class Loggerage {
  /**
   * Constructor for Loggerage
   * @param app               Name for App in localStorage
   * @param defaultLogLevel   Default log level
   * @param version           Version for this App
   */
  constructor(app:string, defaultLogLevel:LoggerageLevel = LoggerageLevel.DEBUG, version:number = 1){
    this.__isStorage__ = false;
    try{
      if(window.localStorage){
        this.__localStorage__ = window.localStorage;
        this.__isStorage__ = true;
      }else{ console.warn(
        colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\'')); }
    } catch (e) {
      if(e.message !== 'window is not defined') throw e;
      try{
        if(global.localStorage){
          this.__localStorage__ = global.localStorage;
          this.__isStorage__ = true;
        }else{ console.warn(
          colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\'')); }
      } catch (e) { if(e.message !== 'global is not defined') throw e; }
    }

    this.__app__ = app;
    this.__version__ = version;
    this.__defaultLogLevel__ = defaultLogLevel;
  }

  /**
   * Set your own Storage
   * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
   * @returns {Loggerage}
   */
  setStorage(otherStorage:any):Loggerage {
    if(!('getItem' in otherStorage) || !('setItem' in otherStorage))
      throw new Error('[otherStorage] param not implement \'getItem\' or \'setItem\' method');
      
    this.__localStorage__ = otherStorage;
    this.__isStorage__ = true;
    return this;
  }

  /**
   * Return the app version
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
   * @returns {Loggerage}
   */
  setDefaultLogLevel(defaultLogLevel:LoggerageLevel):Loggerage {
    this.__defaultLogLevel__ = defaultLogLevel;
    return this;
  }

  /**
   * Get the default log level
   * @returns {string}
   */
  getDefaultLogLevel():string {
    return LoggerageLevel[this.__defaultLogLevel__];
  }

  /**
   * Get the actual log
   * @returns {Array<LoggerageObject>}
   */
  getLog():Array<LoggerageObject>{
    let logs:Array<LoggerageObject> = JSON.parse(this.__localStorage__.getItem(this.__app__) || "[]");
    return logs;
  }

  /**
   * Get the actual log asynchronously
   * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
   * @returns {void}
   */
  getLogAsync(callback:Function):void{
      this.__localStorage__.getItem(this.__app__).then((data) => {
          const logs:Array<LoggerageObject> = JSON.parse(data || "[]");
          callback(null, logs);
      }).catch((err) => {
          callback(err);
      });
  }

  /**
   * Clear all the log
   * @returns {Loggerage}
   */
  clearLog():Loggerage {
    this.__localStorage__.setItem(this.getApp(), "[]");
    return this;
  }

  /**
   * Clear all the log asynchronously
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  clearLogAsync(callback:Function):void {
    this.__localStorage__.setItem(this.getApp(), "[]").then(callback).catch(callback);
  }

  /**
   * Download the log in a file
   * @param type File type (csv || txt)
   * @returns {Loggerage}
   */
  downloadFileLog(type:string = "txt"):Loggerage{
    if(Blob && (window.URL || window["webkitURL"])) {
      console.info("The file is building now");
      let contenido = "";
      switch (type.toLowerCase()) {
        case "txt":
          contenido = Utils.__buildTxtContent__(this.getLog());
          break;
        case "csv":
          contenido = Utils.__buildCsvContent__(this.getLog());
          break;
      }
      let blob = Utils.__getBlob__(contenido, type);
      let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
      Utils.__downloadBlob__(blob, nameFile);
    }else {
      throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
    }
    return this;
  }

  /**
   * Download the log in a file
   * @param type     File type (csv || txt) txt by default
   * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
   * @returns {void}
   */
  downloadFileLogAsync(type:string = "txt", callback:Function):void{
    if(Blob && (window.URL || window["webkitURL"])) {
      console.info("The file is building now");
      let contenido = "";
      this.getLogAsync((logs) => {
        switch (type.toLowerCase()) {
          case "txt":
            contenido = Utils.__buildTxtContent__(logs);
            break;
          case "csv":
            contenido = Utils.__buildCsvContent__(logs);
            break;
        }
        let blob = Utils.__getBlob__(contenido, type);
        let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
        Utils.__downloadBlob__(blob, nameFile);
        callback(null, blob);
      })
    }else {
      callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
    }
  }

  /**
   * Log a message of all levels
   * @param logLevel
   * @param message
   * @param stacktrace [optional]
   * @returns {Loggerage}
   */
  log(logLevel:LoggerageLevel = this.__defaultLogLevel__, message:string, stacktrace?:string):Loggerage {
    if(!this.__isStorage__){
      throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');            
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this.__makeObjectToLog__(logLevel, message);
    const logs:Array<LoggerageObject> = this.getLog();
    logs.push(logObj);
    this.__localStorage__.setItem(this.__app__, JSON.stringify(logs));
    return this;
  }

  /**
   * Log a message of all levels
   * @param logLevel       Level log
   * @param message        Message to log
   * @param stacktrace     (Can be null)
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  logAsync(logLevel:LoggerageLevel = this.__defaultLogLevel__, message:string, stacktrace:string, callback:Function):void {
    if(!this.__isStorage__){
      return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this.__makeObjectToLog__(logLevel, message);

    this.getLogAsync((err, logs) => {
      if(err) return callback(err);

      logs.push(logObj);
      this.__localStorage__.setItem(this.__app__, JSON.stringify(logs)).then(callback).catch(callback);
    });
  }

  /**
   * Log a debug message
   * @param message
   * @returns {Loggerage}
   */
  debug(message:string):Loggerage {
    return this.log(LoggerageLevel.DEBUG, message);
  }
  /**
   * Log a failure message
   * @param message
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  debugAsync(message:string, callback:Function):void {
    this.logAsync(LoggerageLevel.DEBUG, message, null, callback);
  }
  /**
   * Log an info message
   * @param message
   * @returns {Loggerage}
   */
  info(message:string):Loggerage {
    return this.log(LoggerageLevel.INFO, message);
  }
  /**
   * Log a failure message
   * @param message
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  infoAsync(message:string, callback:Function):void {
    this.logAsync(LoggerageLevel.INFO, message, null, callback);
  }
  /**
   * Log a trace message
   * @param message
   * @returns {Loggerage}
   */
  trace(message:string):Loggerage {
    return this.log(LoggerageLevel.TRACE, message);
  }
  /**
   * Log a failure message
   * @param message
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  traceAsync(message:string, callback:Function):void {
    this.logAsync(LoggerageLevel.TRACE, message, null, callback);
  }
  /**
   * Log a success message
   * @param message
   * @returns {Loggerage}
   */
  success(message:string):Loggerage {
    return this.log(LoggerageLevel.SUCCESS, message);
  }
  /**
   * Log a failure message
   * @param message
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  successAsync(message:string, callback:Function):void {
    this.logAsync(LoggerageLevel.SUCCESS, message, null, callback);
  }
  /**
   * Log a warn message
   * @param message
   * @returns {Loggerage}
   */
  warn(message:string):Loggerage {
    return this.log(LoggerageLevel.WARN, message);
  }
  /**
   * Log a failure message
   * @param message
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  warnAsync(message:string, callback:Function):void {
    this.logAsync(LoggerageLevel.WARN, message, null, callback);
  }
  /**
   * Log an error message
   * @param message
   * @param stacktrace
   * @returns {Loggerage}
   */
  error(message:string, stacktrace?:string):Loggerage {
    return this.log(LoggerageLevel.ERROR, message, stacktrace);
  }
  /**
   * Log a failure message
   * @param message
   * @param stacktrace
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  errorAsync(message:string, stacktrace:string, callback:Function):void {
    this.logAsync(LoggerageLevel.ERROR, message, stacktrace, callback);
  }
  /**
   * Log a failure message
   * @param message
   * @param stacktrace
   * @returns {Loggerage}
   */
  failure(message:string, stacktrace?:string):Loggerage {
    return this.log(LoggerageLevel.FAILURE, message, stacktrace);
  }
  /**
   * Log a failure message
   * @param message
   * @param stacktrace
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  failureAsync(message:string, stacktrace:string, callback:Function):void {
    this.logAsync(LoggerageLevel.FAILURE, message, stacktrace, callback);
  }

  //                   //
  //      PRIVATE      //
  //                   //

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
  private __defaultLogLevel__:LoggerageLevel;
  /**
   * Indicate if localStorage is ok (false by default)
   */
  private __isStorage__:boolean;

  /**
   * Make an object for log
   * @param logLevel
   * @param message
   * @private
   * @returns {LoggerageObject}
   */
  private __makeObjectToLog__(logLevel:LoggerageLevel = this.__defaultLogLevel__, message:string):LoggerageObject {
    let logObj = new LoggerageObject(LoggerageLevel[logLevel], message);
    return logObj;
  }
    
}



export class LoggerageObject {
  timestamp:number
  date:string;
  level:string;
  message:string;
  constructor(level:string, message:string){
    const ts = Date.now();
    const now = new Date(ts);
    this.timestamp = ts;
    this.date = now.toLocaleString();
    this.level = level;
    this.message = message;
  }
}

export enum LoggerageLevel {
  DEBUG,
  TRACE,
  SUCCESS, 
  INFO,
  WARN,
  ERROR,
  FAILURE
}

class Utils {
  /**
   * Build content for csv file
   * @param ar {Array}
   * @returns {string}
   */
  static __buildCsvContent__(arr:Array<any>):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join(';') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join(';') + '\n';
    });
    return contenido;
  }
  /**
   * Build content for txt file
   * @param ar {Array}
   * @returns {string}
   */
  static __buildTxtContent__(arr:Array<any>):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join('\t') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join('\t') + '\n';
    });
    return contenido;
  }
  /**
   * Make a blob with content
   * @param content   Content of blob
   * @param type      File type (csv || txt)
   * @returns {Blob}
   */
  static __getBlob__(content:string, type:string = "txt"):Blob {
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
   */
  static __downloadBlob__(blob:Blob, nameFile:string):void {
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
