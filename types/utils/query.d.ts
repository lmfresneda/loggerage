import * as moment from 'moment';
import { LoggerageLevel } from '../loggerage-level';
export declare class Query {
    /**
     * From date in Unix timestamp (milliseconds)
     * @type {number}
     */
    from: number;
    /**
     * To date in Unix timestamp (milliseconds)
     * @type {number}
     */
    to: number;
    /**
     * Log level or levels
     * @type {LoggerageLevel|LoggerageLevel[]}
     */
    level: LoggerageLevel | LoggerageLevel[];
    /**
     * App or logger name (made for custom storages mainly)
     * @type {string}
     */
    app: string;
    /**
     * App or logger version
     * @type {number|string}
     */
    version: number | string;
}
export declare class Queriable {
    isQueryRequested: boolean;
    getQueryRequest(): Query;
    from(from: moment.Moment | Date | string | number, dateStringFormat?: string): Queriable;
    to(to: moment.Moment | Date | string | number, dateStringFormat?: string): Queriable;
    level(level: LoggerageLevel | LoggerageLevel[]): Queriable;
    app(app: string): Queriable;
    version(version: number | string): Queriable;
    resetQuery(): Queriable;
    _fromFormatFilter: string;
    _fromFilter: moment.Moment | Date | string | number;
    _toFormatFilter: string;
    _toFilter: moment.Moment | Date | string | number;
    _levelFilter: LoggerageLevel | LoggerageLevel[];
    _appFilter: string;
    _versionFilter: number | string;
}
