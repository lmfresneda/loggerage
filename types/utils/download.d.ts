import { LoggerageObject } from '../loggerage-object';
import { Queriable } from './query';
export declare class Downloadable {
    /**
     * Download the log in a file
     * @param type File type (csv || txt)
     * @returns {Loggerage}
     */
    downloadFileLog(type?: string): Downloadable;
    /**
     * Download the log in a file
     * @param type     File type (csv || txt) txt by default
     * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
     * @returns {void}
     */
    downloadFileLogAsync(type: string, callback: (error: Error | void, blob?: Blob) => void): void;
    getLogAsync: (callback: (error: Error, data?: LoggerageObject[]) => void) => void;
    getLog: () => LoggerageObject[];
    resetQuery: () => Queriable;
    getApp: () => string;
}
