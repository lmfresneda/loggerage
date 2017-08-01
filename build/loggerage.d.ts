/**
 * loggerage.js v1.0.0
 * (c) lmfresneda <https://github.com/lmfresneda/loggerage>
 */
export declare class Loggerage {
    /**
     * Constructor for Loggerage
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    constructor(app: string, defaultLogLevel?: LoggerageLevel, version?: number);
    /**
     * Set localStorage for test for example
     * @param otherStorage
     * @returns {Loggerage}
     */
    setStorage(otherStorage: any): Loggerage;
    /**
     * Return de app version
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
     * Clear all the log
     * @returns {Loggerage}
     */
    clearLog(): Loggerage;
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {Loggerage}
     */
    downloadFileLog(type?: string): Loggerage;
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {Loggerage}
     */
    log(logLevel: LoggerageLevel, message: string, stacktrace?: string): Loggerage;
    /**
     * Log an info message
     * @param message
     * @returns {Loggerage}
     */
    info(message: string): Loggerage;
    /**
     * Log a debug message
     * @param message
     * @returns {Loggerage}
     */
    debug(message: string): Loggerage;
    /**
     * Log a trace message
     * @param message
     * @returns {Loggerage}
     */
    trace(message: string): Loggerage;
    /**
     * Log a success message
     * @param message
     * @returns {Loggerage}
     */
    success(message: string): Loggerage;
    /**
     * Log a warn message
     * @param message
     * @returns {Loggerage}
     */
    warn(message: string): Loggerage;
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    error(message: string, stacktrace: string): Loggerage;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {Loggerage}
     */
    failure(message: string, stacktrace: string): Loggerage;
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
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LoggerageObject}
     */
    private __makeObjectToLog__(logLevel, message);
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    private static __buildCsvContent__(ar);
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     * @private
     */
    private static __buildTxtContent__(ar);
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     * @private
     */
    private static __getBlob__(content, type?);
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     * @private
     */
    private static __downloadBlob__(blob, nameFile);
}
export declare class LoggerageObject {
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
