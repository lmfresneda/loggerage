import { Queriable } from './utils/query';
import { LoggerageOptions } from './loggerage-options';
import { LoggerageObject } from './loggerage-object';
import { LoggerageLevel } from './loggerage-level';
import { Storage } from './storage-interface';
/**
 * Loggerage class
 */
declare class Loggerage extends Queriable {
    /**
     * Constructor for Loggerage
     * @param app    App or Logger name
     * @param rest   Optional parameters
     */
    constructor(app: string, options?: LoggerageOptions);
    /**
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    setStorage(storage: Storage): Loggerage;
    /**
     * Get the actual log
     * @returns {LoggerageObject[]}
     */
    getLog(): LoggerageObject[];
    /**
     * Get the actual log asynchronously
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
     * @returns {void}
     */
    getLogAsync(callback: (error: Error, data?: LoggerageObject[]) => void): void;
    /**
     * Return the app version
     * @returns {number}
     */
    getVersion(): number | string;
    /**
     * Return the app name for localStorage
     * @returns {string}
     */
    getApp(): string;
    /**
     * Set the default log level
     * @param defaultLogLevel
     * @returns {Loggerage}
     */
    setDefaultLogLevel(defaultLogLevel: LoggerageLevel): Loggerage;
    /**
     * Get the default log level
     * @returns {string}
     */
    getDefaultLogLevel(): string;
    /**
     * Get the default log level number
     * @returns {number}
     */
    getDefaultLogLevelNumber(): number;
    /**
     * Set the silence property
     * @param silence
     * @returns {Loggerage}
     */
    setSilence(silence: boolean): Loggerage;
    /**
     * Get the silence property
     * @returns {boolean}
     */
    getSilence(): boolean;
    /**
     * Clear all the log
     * @returns {Loggerage}
     */
    clearLog(): Loggerage;
    /**
     * Clear all the log asynchronously
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    clearLogAsync(callback: (error: Error | void) => void): void;
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {Loggerage}
     */
    downloadFileLog(type?: string): Loggerage;
    /**
     * Download the log in a file
     * @param type     File type (csv || txt) txt by default
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
     * @returns {void}
     */
    downloadFileLogAsync(type: string, callback: (error: Error | void, blob?: Blob) => void): void;
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {Loggerage}
     */
    log(logLevel: LoggerageLevel, message: string, stacktrace?: string): Loggerage;
    /**
     * Log a message of all levels
     * @param logLevel       Level log
     * @param message        Message to log
     * @param stacktrace     (Can be null)
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    logAsync(logLevel: LoggerageLevel, message: string, stacktrace: string, callback: (error: Error | void) => void): void;
    /**
     * Log a debug message
     * @param message
     * @returns {Loggerage}
     */
    debug(message: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    debugAsync(message: string, callback: (error: Error | void) => void): void;
    /**
     * Log an info message
     * @param message
     * @returns {Loggerage}
     */
    info(message: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    infoAsync(message: string, callback: (error: Error | void) => void): void;
    /**
     * Log a trace message
     * @param message
     * @returns {Loggerage}
     */
    trace(message: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    traceAsync(message: string, callback: (error: Error | void) => void): void;
    /**
     * Log a success message
     * @param message
     * @returns {Loggerage}
     */
    success(message: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    successAsync(message: string, callback: (error: Error | void) => void): void;
    /**
     * Log a warn message
     * @param message
     * @returns {Loggerage}
     */
    warn(message: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    warnAsync(message: string, callback: (error: Error | void) => void): void;
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    error(message: string, stacktrace?: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    errorAsync(message: string, stacktrace: string, callback: (error: Error | void) => void): void;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    failure(message: string, stacktrace?: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @param callback    Is a function that recived one param, an error if occurs, otherwise this param is null.
     * @returns {void}
     */
    failureAsync(message: string, stacktrace: string, callback: (error: Error | void) => void): void;
    /**
     * Return a stored logger
     * @param  {string}    app App or logger name
     * @return {Loggerage}
     */
    static getLogger(app: string): Loggerage;
    /**
     * Destroy a stored logger
     * @param {string} app App or logger name
     */
    static destroy(app: string): void;
    /**
     * App name for localStorage
     */
    private _app;
    /**
     * Indicate if localStorage is ok (false by default)
     */
    private _isStorageOk;
    /**
     * Options for logger
     */
    private _options;
    /**
     * Store of loggers
     */
    private static _loggers;
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    private _makeLoggerageObject(logLevel, message);
}
export { Loggerage, LoggerageOptions, LoggerageObject, LoggerageLevel };
