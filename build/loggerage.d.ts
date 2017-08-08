/**
 * Loggerage class
 */
export declare class Loggerage {
    /**
     * Constructor for Loggerage
     * @param app    App or Logger name
     * @param rest   Optional parameters
     */
    constructor(app: string, ...rest: any[]);
    /**
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    setStorage(storage: any): Loggerage;
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
     * Get the actual log
     * @returns {Array<LoggerageObject>}
     */
    getLog(): Array<LoggerageObject>;
    /**
     * Get the actual log asynchronously
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is log.
     * @returns {void}
     */
    getLogAsync(callback: Function): void;
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
    clearLogAsync(callback: Function): void;
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
    downloadFileLogAsync(type: string, callback: Function): void;
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
    logAsync(logLevel: LoggerageLevel, message: string, stacktrace: string, callback: Function): void;
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
    debugAsync(message: string, callback: Function): void;
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
    infoAsync(message: string, callback: Function): void;
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
    traceAsync(message: string, callback: Function): void;
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
    successAsync(message: string, callback: Function): void;
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
    warnAsync(message: string, callback: Function): void;
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
    errorAsync(message: string, stacktrace: string, callback: Function): void;
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
    failureAsync(message: string, stacktrace: string, callback: Function): void;
    private __localStorage__;
    /**
     * App name for localStorage
     */
    private __app__;
    /**
     * If true, will not be displayed console logs
     */
    private __silence__;
    /**
     * Version number for this app log
     */
    private __version__;
    /**
     * Default log level
     */
    private __defaultLogLevel__;
    /**
     * Indicate if localStorage is ok (false by default)
     */
    private __isStorage__;
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    private __makeObjectToLog__(logLevel, message);
}
/**
 * Each log
 */
export declare class LoggerageObject {
    /**
     * App or logger name
     * @type {string}
     */
    app: string;
    /**
     * App or logger version
     * @type {number|string}
     */
    version: number | string;
    /**
     * Timestamp of date log
     * @type {number}
     */
    timestamp: number;
    /**
     * Date log
     * @type {string}
     */
    date: string;
    /**
     * Level log
     * @type {string}
     */
    level: string;
    /**
     * Message log
     * @type {string}
     */
    message: string;
    /**
     * Constructor
     * @param {string} _level
     * @param {string} _message
     * @param {string} _app     Optional
     */
    constructor(_level: string, _message: string, _app?: string, _version?: number | string);
}
/**
 * Util enum for log level
 */
export declare enum LoggerageLevel {
    DEBUG = 0,
    TRACE = 1,
    SUCCESS = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    FAILURE = 6,
}
/**
 * Options for Loggerage constructor
 */
export declare class LoggerageOptions {
    /**
     * Indicate if storage is default localStorage.
     * @default true
     * @type {boolean}
     */
    isLocalStorage: boolean;
    /**
     * If true, will not be displayed console logs
     * @default false
     * @type {boolean}
     */
    silence: boolean;
    /**
     * Version aplicatton
     * @default 1
     * @type {Number|String}
     */
    version: number | string;
    /**
     * Default log level if call .log() method directly
     * @default LoggerageLevel.DEBUG
     * @type {LoggerageLevel}
     */
    defaultLogLevel: LoggerageLevel;
    /**
     * Storage to use. Should implement 'getItem' and 'setItem' of Storage interface
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
     * @type {any}
     */
    storage: any;
}
