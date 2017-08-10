import * as moment from 'moment';
import { LoggerageObject } from '../loggerage-object';
import { Query } from './query';
export declare const QUERY_FORMAT_DATE = "YYYY-MM-DD HH:mm:ss.SSS";
/**
 * Class of utilities
 */
export declare class Utils {
    static getLogFiltered(logs: LoggerageObject[], query: Query): LoggerageObject[];
    /**
     * Return unix timestamp (milliseconds) from any type of date
     * @param  {moment.Moment|Date|string|number} date
     * @param  {string}                           dateStringFormat Optional. If we want to indicate our format according to the formats of momentjs.
     *                                                             By default 'YYYY-MM-DD HH:mm:ss.SSS'
     * @return {number}                                            Unix timestamp (milliseconds)
     */
    static getUnixDate(date: moment.Moment | Date | string | number, dateStringFormat?: string): number;
    /**
     * Build content for csv file
     * @param ar {Array}
     * @returns {string}
     */
    static buildCsvContent(arr: any[]): string;
    /**
     * Build content for txt file
     * @param ar {Array}
     * @returns {string}
     */
    static buildTxtContent(arr: any[]): string;
    /**
     * Make a blob with content
     * @param content   Content of blob
     * @param type      File type (csv || txt)
     * @returns {Blob}
     */
    static getBlob(content: string, type?: string): Blob;
    /**
     * Fire the download file
     * @param blob
     * @param nameFile
     */
    static downloadBlob(blob: Blob, nameFile: string): void;
}
