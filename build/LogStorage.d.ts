/**
 * LogStorage.js v0.2.1
 * (c) Luis M. Fresneda
 */
declare class LogStorage {
    /**
     * Constructor for LogStorage
     * @param app               Name for App in localStorage
     * @param defaultLogLevel   Default log level
     * @param version           Version for this App
     */
    constructor(app: string, defaultLogLevel?: LogStorageLevel, version?: number);
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
     * @returns {LogStorage}
     */
    setDefaultLogLevel(defaultLogLevel: LogStorageLevel): LogStorage;
    /**
     * Get the default log level
     * @returns {string}
     */
    getDefaultLogLevel(): string;
    /**
     * Get the actual log
     * @returns {Array<LogStorageObject>}
     */
    getLog(): Array<LogStorageObject>;
    /**
     * Clear all the log
     * @returns {LogStorage}
     */
    clearLog(): LogStorage;
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {LogStorage}
     */
    downloadFileLog(type?: string): LogStorage;
    /**
     * Log a message of all levels
     * @param logLevel
     * @param message
     * @param stacktrace [optional]
     * @returns {LogStorage}
     */
    log(logLevel: LogStorageLevel, message: string, stacktrace?: string): LogStorage;
    /**
     * Log an info message
     * @param message
     * @returns {LogStorage}
     */
    info(message: string): LogStorage;
    /**
     * Log a debug message
     * @param message
     * @returns {LogStorage}
     */
    debug(message: string): LogStorage;
    /**
     * Log a trace message
     * @param message
     * @returns {LogStorage}
     */
    trace(message: string): LogStorage;
    /**
     * Log a success message
     * @param message
     * @returns {LogStorage}
     */
    success(message: string): LogStorage;
    /**
     * Log a warn message
     * @param message
     * @returns {LogStorage}
     */
    warn(message: string): LogStorage;
    /**
     * Log an error message
     * @param message
     * @param stacktrace
     * @returns {LogStorage}
     */
    error(message: string, stacktrace: string): LogStorage;
    /**
     * Log a failure message
     * @param message
     * @param stacktrace
     * @returns {LogStorage}
     */
    failure(message: string, stacktrace: string): LogStorage;
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
     * @returns {LogStorageObject}
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
declare class LogStorageObject {
    date: string;
    level: string;
    message: string;
    constructor(level: string, message: string);
}
declare enum LogStorageLevel {
    DEBUG = 0,
    TRACE = 1,
    SUCCESS = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    FAILURE = 6,
}
