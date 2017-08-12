import * as moment from 'moment';
import { LoggerageLevel } from '../loggerage-level';
import { Utils } from './utils';

export class Query {
  /**
   * From date in Unix timestamp (milliseconds)
   * @type {number}
   */
  from:number;
  /**
   * To date in Unix timestamp (milliseconds)
   * @type {number}
   */
  to:number;
  /**
   * Log level or levels
   * @type {LoggerageLevel|LoggerageLevel[]}
   */
  level:LoggerageLevel|LoggerageLevel[];
  /**
   * App or logger name (made for custom storages mainly)
   * @type {string}
   */
  app:string;
  /**
   * App or logger version
   * @type {number|string}
   */
  version:number|string;
}

export class Queriable {

  isQueryRequested:boolean = false;

  getQueryRequest():Query{
    const query = new Query();
    if(this._fromFilter != null)
      query.from = Utils.getUnixDate(this._fromFilter, this._fromFormatFilter);
    if(this._toFilter != null)
      query.to = Utils.getUnixDate(this._toFilter, this._fromFormatFilter);

    if(this._levelFilter != null)
      query.level = this._levelFilter;
    if(this._appFilter != null)
      query.app = this._appFilter;
    if(this._versionFilter != null)
      query.version = this._versionFilter;
    return query;
  }

  from(from:moment.Moment|Date|string|number, dateStringFormat?:string):Queriable{
    this._fromFilter = from;
    if(dateStringFormat) this._fromFormatFilter = dateStringFormat;
    this.isQueryRequested = true;
    return this;
  }
  to(to:moment.Moment|Date|string|number, dateStringFormat?:string):Queriable{
    this._toFilter = to;
    if(dateStringFormat) this._toFormatFilter = dateStringFormat;
    this.isQueryRequested = true;
    return this;
  }
  level(level:LoggerageLevel|LoggerageLevel[]):Queriable{
    this._levelFilter = level;
    this.isQueryRequested = true;
    return this;
  }
  app(app:string):Queriable{
    this._appFilter = app;
    this.isQueryRequested = true;
    return this;
  }
  version(version:number|string):Queriable{
    this._versionFilter = version;
    this.isQueryRequested = true;
    return this;
  }

  resetQuery():Queriable{
    if(this.isQueryRequested){
      this.isQueryRequested = false;
      this._fromFormatFilter = null;
      this._fromFilter = null;
      this._toFormatFilter = null;
      this._toFilter = null;
      this._levelFilter = null;
      this._appFilter = null;
      this._versionFilter = null;
    }
    return this;
  }

  _fromFormatFilter:string;
  _fromFilter:moment.Moment|Date|string|number;
  _toFormatFilter:string;
  _toFilter:moment.Moment|Date|string|number;
  _levelFilter:LoggerageLevel|LoggerageLevel[];
  _appFilter:string;
  _versionFilter:number|string;
}
