/**
 * LogStorage.js v0.2.2
 * (c) Luis M. Fresneda
 */
declare class LogStorageJS {
    /**
     * Constructor for LogStorageJS
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    constructor(app: string, defaultLogLevel?: LogStorageJSLevel, version?: number);/**
     * Set localStorage for test for example
     * @param otherStorage
     * @returns {LogStorageJS}
     */
    setStorage(otherStorage:any):LogStorageJS;
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
     * @returns {LogStorageJS}
     */
    setDefaultLogLevel(defaultLogLevel: LogStorageJSLevel): LogStorageJS;
    /**
     * Get the default log level
     * @returns {string}
     */
    getDefaultLogLevel(): string;
    /**
     * Get the actual log
     * @returns {Array<LogStorageJSObject>}
     */
    getLog(): Array<LogStorageJSObject>;
    /**
     * Clear all the log
     * @returns {LogStorageJS}
     */
    clearLog(): LogStorageJS;
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {LogStorageJS}
     */
    downloadFileLog(type?: string): LogStorageJS;
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {LogStorageJS}
     */
    log(logLevel: LogStorageJSLevel, message: string, stacktrace?: string): LogStorageJS;
    /**
     * Log an info message
     * @param message
     * @returns {LogStorageJS}
     */
    info(message: string): LogStorageJS;
    /**
     * Log a debug message
     * @param message
     * @returns {LogStorageJS}
     */
    debug(message: string): LogStorageJS;
    /**
     * Log a trace message
     * @param message
     * @returns {LogStorageJS}
     */
    trace(message: string): LogStorageJS;
    /**
     * Log a success message
     * @param message
     * @returns {LogStorageJS}
     */
    success(message: string): LogStorageJS;
    /**
     * Log a warn message
     * @param message
     * @returns {LogStorageJS}
     */
    warn(message: string): LogStorageJS;
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    error(message: string, stacktrace: string): LogStorageJS;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {LogStorageJS}
     */
    failure(message: string, stacktrace: string): LogStorageJS;
    /**
     * App name for localStorage
     */
    private __app;
    /**
     * Version number for this app log
     */
    private __version;
    /**
     * Default log level
     */
    private __defaultLogLevel;
    /**
     * Make an object for log
     * @param logLevel
     * @param message
     * @private
     * @returns {LogStorageJSObject}
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
declare class LogStorageJSObject {
    date: string;
    level: string;
    message: string;
    constructor(level: string, message: string);
}
declare enum LogStorageJSLevel {
    DEBUG = 0,
    TRACE = 1,
    SUCCESS = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    FAILURE = 6,
}