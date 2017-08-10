/// <reference types="es6-promise" />

/**
 * (c) loggerage contributors
 * https://github.com/lmfresneda/loggerage
 */
import * as colors from 'colors';
import * as assign from 'object-assign';
import * as moment from 'moment';
import { Utils } from './utils/utils';
import { WrapLocalStorage } from './utils/wrap-localstorage';
import { Queriable } from './utils/query';
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
class Loggerage extends Queriable {

  //========================//
  //      CONSTRUCTOR       //
  //========================//

  /**
   * Constructor for Loggerage
   * @param app    App or Logger name
   * @param rest   Optional parameters
   */
  constructor(app:string, options?:LoggerageOptions){
    super();
    this._options = new LoggerageOptions();

    if(options) this._options = assign(this._options, options);

    if(!this._options.storage && this._options.isLocalStorage){
      try{ if(window.localStorage) this._options.storage = new WrapLocalStorage(window.localStorage);
      } catch (e) {
        if(e.message !== 'window is not defined') throw e;
        try{ if(global.localStorage) this._options.storage = new WrapLocalStorage(global.localStorage);
        } catch (e) { if(e.message !== 'global is not defined') throw e; }
      }
    }

    if(this._options.storage){
      this._isStorageOk = true;
    }else if(!this._options.silence){
      console.warn(
        colors.yellow('WARN: localStorage not found. Remember set your Storage by \'.setStorage() method\''));
    }
    this._app = app;
    Loggerage._loggers[this._app] = this;
    this.resetQuery();
  }

  //====================//
  //      STORAGE       //
  //====================//

  /**
   * Set your own Storage
   * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
   * @returns {Loggerage}
   */
  setStorage(storage:Storage):Loggerage {
    this._options.storage = storage;
    this._isStorageOk = true;
    this.resetQuery();
    return this;
  }

  //====================//
  //      GET LOG       //
  //====================//

  /**
   * Get the actual log
   * @returns {LoggerageObject[]}
   */
  getLog():LoggerageObject[]{
    const logs = (
      this._options.storage.getItem(this._app, this.isQueryRequested ? this.getQueryRequest() : null)
    ) as LoggerageObject[];
    this.resetQuery();
    return logs;
  }

  /**
   * Get the actual log asynchronously
   * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
   * @returns {void}
   */
  getLogAsync(callback:(error:Error, data?:LoggerageObject[]) => void):void{
    Promise.resolve(
        this._options.storage.getItem(this._app, this.isQueryRequested ? this.getQueryRequest() : null)
    ).then((data) => {
      this.resetQuery();
      callback(null, data);
    }).catch((err) => {
      this.resetQuery();
      callback(err);
    });
  }

  //================================//
  //      GET/SET INFO LOGGER       //
  //================================//

  /**
   * Return the app version
   * @returns {number}
   */
  getVersion():number|string {
    this.resetQuery();
    return this._options.version;
  }

  /**
   * Return the app name for localStorage
   * @returns {string}
   */
  getApp():string {
    this.resetQuery();
    return this._app;
  }

  /**
   * Set the default log level
   * @param defaultLogLevel
   * @returns {Loggerage}
   */
  setDefaultLogLevel(defaultLogLevel:LoggerageLevel):Loggerage {
    this._options.defaultLogLevel = defaultLogLevel;
    this.resetQuery();
    return this;
  }

  /**
   * Get the default log level
   * @returns {string}
   */
  getDefaultLogLevel():string {
    this.resetQuery();
    return LoggerageLevel[this._options.defaultLogLevel];
  }

  /**
   * Get the default log level number
   * @returns {number}
   */
  getDefaultLogLevelNumber():number {
    this.resetQuery();
    return this._options.defaultLogLevel;
  }

  /**
   * Set the silence property
   * @param silence
   * @returns {Loggerage}
   */
  setSilence(silence:boolean):Loggerage {
    this._options.silence = silence;
    this.resetQuery();
    return this;
  }

  /**
   * Get the silence property
   * @returns {boolean}
   */
  getSilence():boolean {
    this.resetQuery();
    return this._options.silence;
  }

  //======================//
  //      CLEAR LOG       //
  //======================//

  /**
   * Clear all the log
   * @returns {Loggerage}
   */
  clearLog():Loggerage {
    this._options.storage.clear();
    this.resetQuery();
    return this;
  }

  /**
   * Clear all the log asynchronously
   * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
   * @returns {void}
   */
  clearLogAsync(callback:(error:Error|void) => void):void {
    Promise.resolve(this._options.storage.clear()).then(() => {
      this.resetQuery();
      callback(null);
    }).catch((err) => {
      this.resetQuery();
      callback(err);
    });
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
    this.resetQuery();
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
        this.resetQuery();
        callback(null, blob);
      })
    }else {
      this.resetQuery();
      callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
    }
  }

  //========================//
  //      LOG METHODS       //
  //========================//

  /**
   * Log a message of all levels
   * @param logLevel
   * @param message
   * @param stacktrace [optional]
   * @returns {Loggerage}
   */
  log(logLevel:LoggerageLevel = this._options.defaultLogLevel, message:string, stacktrace?:string):Loggerage {
    if(!this._isStorageOk){
      throw new Error('localStorage not found. Set your Storage by \'.setStorage() method\'');
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this._makeLoggerageObject(logLevel, message);
    this._options.storage.setItem(this._app, logObj);
    this.resetQuery();
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
  logAsync(logLevel:LoggerageLevel = this._options.defaultLogLevel, message:string, stacktrace:string, callback:(error:Error|void) => void):void {
    if(!this._isStorageOk){
      return callback(new Error('localStorage not found. Set your Storage by \'.setStorage() method\''));
    }

    if(stacktrace){
      message += `\n[Stack Trace: ${stacktrace}]`;
    }
    const logObj:LoggerageObject = this._makeLoggerageObject(logLevel, message);
    Promise.resolve(this._options.storage.setItem(this._app, logObj)).then(() => {
      this.resetQuery();
      callback(null);
    }).catch((err) => {
      this.resetQuery();
      callback(err);
    });
  }

  //=============================//
  //      EASY LOG METHODS       //
  //=============================//

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

  //===========================//
  //      STATIC METHODS       //
  //===========================//

  /**
   * Return a stored logger
   * @param  {string}    app App or logger name
   * @return {Loggerage}
   */
  static getLogger(app:string): Loggerage {
    return Loggerage._loggers[app] as Loggerage;
  }
  /**
   * Destroy a stored logger
   * @param {string} app App or logger name
   */
  static destroy(app:string): void {
    delete Loggerage._loggers[app];
  }

  //===================//
  //      PRIVATE      //
  //===================//

  /**
   * App name for localStorage
   */
  private _app:string;
  /**
   * Indicate if localStorage is ok (false by default)
   */
  private _isStorageOk:boolean = false;
  /**
   * Options for logger
   */
  private _options:LoggerageOptions;
  /**
   * Store of loggers
   */
  private static _loggers:any = {};
  /**
   * Make an object for log
   * @param logLevel
   * @param message
   * @private
   * @returns {LoggerageObject}
   */
  private _makeLoggerageObject(logLevel:LoggerageLevel, message:string):LoggerageObject {
    let logObj = new LoggerageObject(LoggerageLevel[logLevel], message, this._app, this._options.version);
    return logObj;
  }
}

export { Loggerage, LoggerageOptions, LoggerageObject, LoggerageLevel };
