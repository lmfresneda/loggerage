export declare class Loggerage {
    /**
     * Constructor for Loggerage
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    constructor(app: string, defaultLogLevel?: LoggerageLevel, version?: number);
    /**
     * Set your own Storage
     * @param otherStorage        Your Storage that implement Storage interface [https://developer.mozilla.org/en-US/docs/Web/API/Storage]
     * @returns {Loggerage}
     */
    setStorage(otherStorage: any): Loggerage;
    /**
     * Return the app version
     * @returns {number}
     */
    getVersion(): number;
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
export declare class LoggerageObject {
    timestamp: number;
    date: string;
    level: string;
    message: string;
    constructor(level: string, message: string);
}
export declare enum LoggerageLevel {
    DEBUG = 0,
    TRACE = 1,
    SUCCESS = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    FAILURE = 6,
}
