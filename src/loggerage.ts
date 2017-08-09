/// <reference types="es6-promise" />

/**
 * (c) loggerage contributors
 * https://github.com/lmfresneda/loggerage
 */
import * as colors from 'colors';
import * as assign from 'object-assign';
import { Utils } from './utils/utils';
import { WrapLocalStorage } from './utils/wrap-localstorage';
import { LoggerageOptions } from './loggerage-options';
import { LoggerageObject } from './loggerage-object';
import { LoggerageLevel } from './loggerage-level';
import { Storage } from './storage-interface';

/**
 * For simulate global scope
 */
declare var global: any;



/**
 * Loggerage class
 */
class Loggerage {
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
      try{ if(window.localStorage) storage = new WrapLocalStorage(window.localStorage);
      } catch (e) {
        if(e.message !== 'window is not defined') throw e;
        try{ if(global.localStorage) storage = new WrapLocalStorage(global.localStorage);
        } catch (e) { if(e.message !== 'global is not defined') throw e; }
      }
    }

    if(storage){
      this._storage = storage;
      this._isStorageOk = true;
    }else if(!options.silence){
      console.warn(
        colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
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
  setStorage(storage:Storage):Loggerage {
    this._storage = storage;
    this._isStorageOk = true;
    return this;
  }

  /**
   * Return the app version
   * @returns {number}
   */
  getVersion():number|string { return this._version; }

  /**
   * Return the app name for localStorage
   * @returns {string}
   */
  getApp():string { return this._app; }

  /**
   * Set the default log level
   * @param defaultLogLevel
   * @returns {Loggerage}
   */
  setDefaultLogLevel(defaultLogLevel:LoggerageLevel):Loggerage {
    this._defaultLogLevel = defaultLogLevel;
    return this;
  }

  /**
   * Get the default log level
   * @returns {string}
   */
  getDefaultLogLevel():string {
    return LoggerageLevel[this._defaultLogLevel];
  }

  /**
   * Get the default log level number
   * @returns {number}
   */
  getDefaultLogLevelNumber():number {
    return this._defaultLogLevel;
  }

  /**
   * Set the silence property
   * @param silence
   * @returns {Loggerage}
   */
  setSilence(silence:boolean):Loggerage {
    this._silence = silence;
    return this;
  }

  /**
   * Get the silence property
   * @returns {boolean}
   */
  getSilence():boolean {
    return this._silence;
  }

  /**
   * Get the actual log
   * @returns {LoggerageObject[]}
   */
  getLog():LoggerageObject[]{
    const logs = this._storage.getItem(this._app) as LoggerageObject[];
    return logs;
  }

  /**
   * Get the actual log asynchronously
   * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
   * @returns {void}
   */
  getLogAsync(callback:(error:Error, data?:LoggerageObject[]) => void):void{
    Promise.resolve(this._storage.getItem(this._app)).then((data) => {
      const logs:LoggerageObject[] = data;
      callback(null, data);
    }).catch((err) => {
      callback(err);
    });
  }

  /**
   * Clear all the log
   * @returns {Loggerage}
   */
  clearLog():Loggerage {
    this._storage.clear();
    return this;
  }

  /**
   * Clear all the log asynchronously
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  clearLogAsync(callback:(error:Error|void) => void):void {
    Promise.resolve(this._storage.clear()).then(callback).catch(callback);
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
  downloadFileLogAsync(type:string = "txt", callback:(error:Error|void, blob?:Blob) => void):void{
    if(Blob && (window.URL || window["webkitURL"])) {
      console.info("The file is building now");
      let contenido = "";
      this.getLogAsync((err, logs) => {
        if(err) return callback(err);

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
  log(logLevel:LoggerageLevel = this._defaultLogLevel, message:string, stacktrace?:string):Loggerage {
    if(!this._isStorageOk){
      throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this._makeLoggerageObject(logLevel, message);
    this._storage.setItem(this._app, logObj);
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
  logAsync(logLevel:LoggerageLevel = this._defaultLogLevel, message:string, stacktrace:string, callback:(error:Error|void) => void):void {
    if(!this._isStorageOk){
      return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this._makeLoggerageObject(logLevel, message);

    Promise.resolve(this._storage.setItem(this._app, logObj)).then(callback).catch(callback);
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
  debugAsync(message:string, callback:(error:Error|void) => void):void {
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
  infoAsync(message:string, callback:(error:Error|void) => void):void {
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
  traceAsync(message:string, callback:(error:Error|void) => void):void {
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
  successAsync(message:string, callback:(error:Error|void) => void):void {
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
  warnAsync(message:string, callback:(error:Error|void) => void):void {
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
  errorAsync(message:string, stacktrace:string, callback:(error:Error|void) => void):void {
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
  failureAsync(message:string, stacktrace:string, callback:(error:Error|void) => void):void {
    this.logAsync(LoggerageLevel.FAILURE, message, stacktrace, callback);
  }

  //                   //
  //      PRIVATE      //
  //                   //

  private _storage:Storage;
  /**
   * App name for localStorage
   */
  private _app:string;
  /**
   * If true, will not be displayed console logs
   */
  private _silence:boolean;
  /**
   * Version number for this app log
   */
  private _version:number|string;
  /**
   * Default log level
   */
  private _defaultLogLevel:LoggerageLevel;
  /**
   * Indicate if localStorage is ok (false by default)
   */
  private _isStorageOk:boolean = false;

  /**
   * Make an object for log
   * @param logLevel
   * @param message
   * @private
   * @returns {LoggerageObject}
   */
  private _makeLoggerageObject(logLevel:LoggerageLevel = this._defaultLogLevel, message:string):LoggerageObject {
    let logObj = new LoggerageObject(LoggerageLevel[logLevel], message, this._app, this._version);
    return logObj;
  }
}

export { Loggerage, LoggerageOptions, LoggerageObject, LoggerageLevel };
