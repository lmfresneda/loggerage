/**
 * (c) loggerage contributors 
 * https://github.com/lmfresneda/loggerage
 */

import * as colors from 'colors';
import * as assign from 'object-assign';

/**
 * For simulate global scope
 */
declare var global: any;

/**
 * Loggerage class
 */
export class Loggerage {
  /**
   * Constructor for Loggerage
   * @param app    App or Logger name
   * @param rest   Optional parameters
   */
  constructor(app:string, ...rest:any[]){
    let options = new LoggerageOptions();

    if(rest.length && typeof rest[0] === 'object'){
      options = assign(options, rest[0]);
    }else if(rest.length){
      console.warn(
        colors.yellow('WARN: Remember, the old constructor is deprecated. See [https://github.com/lmfresneda/loggerage#new-constructor] for more details')); 
      options.defaultLogLevel = rest[0];
      options.version = rest[1] || 1;
    }
    var storage = options.storage;
    if(!storage && options.isLocalStorage){
      try{ if(window.localStorage) storage = window.localStorage; 
      } catch (e) {
        if(e.message !== 'window is not defined') throw e;
        try{ if(global.localStorage) storage = global.localStorage;
        } catch (e) { if(e.message !== 'global is not defined') throw e; }
      }
    }

    if(storage && !Utils.isStorageInterface(storage)){
      throw new Error('[storage] property not implement \'getItem\' or \'setItem\' method');
    }

    if(storage){
      this.__localStorage__ = storage;
      this.__isStorage__ = true;
    }else if(!options.silence){
      console.warn(
        colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\'')); 
    }
    this.__silence__ = options.silence;
    this.__app__ = app;
    this.__version__ = options.version;
    this.__defaultLogLevel__ = options.defaultLogLevel;
  }

  /**
   * Set your own Storage
   * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
   * @returns {Loggerage}
   */
  setStorage(storage:any):Loggerage {
    if(!Utils.isStorageInterface(storage))
      throw new Error('[storage] param not implement \'getItem\' or \'setItem\' method');
      
    this.__localStorage__ = storage;
    this.__isStorage__ = true;
    return this;
  }

  /**
   * Return the app version
   * @returns {number}
   */
  getVersion():number|string { return this.__version__; }

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
   * Get the default log level number
   * @returns {number}
   */
  getDefaultLogLevelNumber():number {
    return this.__defaultLogLevel__;
  }

  /**
   * Set the silence property
   * @param silence
   * @returns {Loggerage}
   */
  setSilence(silence:boolean):Loggerage {
    this.__silence__ = silence;
    return this;
  }

  /**
   * Get the silence property
   * @returns {boolean}
   */
  getSilence():boolean {
    return this.__silence__;
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
          contenido = Utils.buildTxtContent(this.getLog());
          break;
        case "csv":
          contenido = Utils.buildCsvContent(this.getLog());
          break;
      }
      let blob = Utils.getBlob(contenido, type);
      let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
      Utils.downloadBlob(blob, nameFile);
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
            contenido = Utils.buildTxtContent(logs);
            break;
          case "csv":
            contenido = Utils.buildCsvContent(logs);
            break;
        }
        let blob = Utils.getBlob(contenido, type);
        let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
        Utils.downloadBlob(blob, nameFile);
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
   * If true, will not be displayed console logs
   */
  private __silence__:boolean;
  /**
   * Version number for this app log
   */
  private __version__:number|string;
  /**
   * Default log level
   */
  private __defaultLogLevel__:LoggerageLevel;
  /**
   * Indicate if localStorage is ok (false by default)
   */
  private __isStorage__:boolean = false;

  /**
   * Make an object for log
   * @param logLevel
   * @param message
   * @private
   * @returns {LoggerageObject}
   */
  private __makeObjectToLog__(logLevel:LoggerageLevel = this.__defaultLogLevel__, message:string):LoggerageObject {
    let logObj = new LoggerageObject(LoggerageLevel[logLevel], message, this.__app__, this.__version__);
    return logObj;
  }
    
}


/**
 * Each log
 */
export class LoggerageObject {
  /**
   * App or logger name
   * @type {string}
   */
  app:string;
  /**
   * App or logger version
   * @type {number|string}
   */
  version:number|string;
  /**
   * Timestamp of date log
   * @type {number}
   */
  timestamp:number;
  /**
   * Date log
   * @type {string}
   */
  date:string;
  /**
   * Level log
   * @type {string}
   */
  level:string;
  /**
   * Message log
   * @type {string}
   */
  message:string;
  /**
   * Constructor
   * @param {string} _level   
   * @param {string} _message 
   * @param {string} _app     Optional
   */
  constructor(_level:string, _message:string, _app?:string, _version?:number|string){
    const ts = Date.now();
    const now = new Date(ts);
    this.timestamp = ts;
    this.date = now.toLocaleString();
    this.level = _level;
    this.message = _message;
    if(_app) this.app = _app;
    if(_version) this.version = _version;
  }
}

/**
 * Util enum for log level
 */
export enum LoggerageLevel {
  DEBUG,
  TRACE,
  SUCCESS, 
  INFO,
  WARN,
  ERROR,
  FAILURE
}

/**
 * Options for Loggerage constructor
 */
export class LoggerageOptions {
  /**
   * Indicate if storage is default localStorage.
   * @default true
   * @type {boolean}
   */
  isLocalStorage:boolean = true;
  /**
   * If true, will not be displayed console logs
   * @default false
   * @type {boolean}
   */
  silence:boolean = false;
  /**
   * Version aplicatton
   * @default 1
   * @type {Number|String}
   */
  version:number|string = 1;
  /**
   * Default log level if call .log() method directly
   * @default LoggerageLevel.DEBUG
   * @type {LoggerageLevel}
   */
  defaultLogLevel:LoggerageLevel = LoggerageLevel.DEBUG;
  /**
   * Storage to use. Should implement 'getItem' and 'setItem' of Storage interface
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
   * @type {any}
   */
  storage:any;
}

/**
 * Class of utilities
 */
class Utils {
  /**
   * Valid if storage implement Storage interface
   * @param {any} storage 
   */
  static isStorageInterface(storage:any){
    return 'getItem' in storage && 'setItem' in storage;
  }
  /**
   * Build content for csv file
   * @param ar {Array}
   * @returns {string}
   */
  static buildCsvContent(arr:Array<any>):string {
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
  static buildTxtContent(arr:Array<any>):string {
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
  static getBlob(content:string, type:string = "txt"):Blob {
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
  static downloadBlob(blob:Blob, nameFile:string):void {
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
