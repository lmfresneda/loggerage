import * as moment from 'moment';
import * as includes from 'array-includes';
import { LoggerageObject } from '../loggerage-object';
import { LoggerageLevel } from '../loggerage-level';
import { Query } from './query';

export const QUERY_FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss.SSS';

/**
 * Class of utilities
 */
export class Utils {
  static getLogFiltered(logs:LoggerageObject[], query:Query){
    if(!logs || !query || !logs.length) return logs;

    logs = logs.filter((log) => {
      let ok = true;

      if(query.from)
        ok = moment(log.timestamp).isSameOrAfter(query.from);
      if(ok && query.to)
        ok = moment(log.timestamp).isSameOrBefore(query.to);
      if(ok && query.app) ok = log.app === query.app;
      if(ok && query.version) ok = log.version === query.version;
      if(ok && query.level && query.level instanceof Array) {
        ok = includes(query.level, log.level_number);
      }else if(ok && query.level != undefined){
        ok = log.level_number === query.level;
      }

      return ok;
    });

    return logs;
  }
  /**
   * Return unix timestamp (milliseconds) from any type of date
   * @param  {moment.Moment|Date|string|number} date
   * @param  {string}                           dateStringFormat Optional. If we want to indicate our format according to the formats of momentjs.
   *                                                             By default 'YYYY-MM-DD HH:mm:ss.SSS'
   * @return {number}                                            Unix timestamp (milliseconds)
   */
  static getUnixDate(date:moment.Moment|Date|string|number, dateStringFormat?:string): number {
    if(date instanceof Date){
      return date.getTime();
    }else if(typeof date == typeof moment()){
      return date.valueOf() as number;
    }else if(typeof date == 'string'){
      if(dateStringFormat){
        return moment(date, dateStringFormat).valueOf() as number;
      }else{
        return moment(date, QUERY_FORMAT_DATE).valueOf() as number;
      }
    }
    return date as number;
  }
  /**
   * Build content for csv file
   * @param ar {Array}
   * @returns {string}
   */
  static buildCsvContent(arr:any[]):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join(';') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join(';') + '\n';
    });
    return contenido;
  }
  /**
   * Build content for txt file
   * @param ar {Array}
   * @returns {string}
   */
  static buildTxtContent(arr:any[]):string {
    let contenido = '';
    if(!arr.length) return contenido;
    contenido += Object.keys(arr[0]).join('\t') + '\n';
    arr.forEach((obj) => {
      contenido += Object.keys(obj).map(key => obj[key]).join('\t') + '\n';
    });
    return contenido;
  }
  /**
   * Make a blob with content
   * @param content   Content of blob
   * @param type      File type (csv || txt)
   * @returns {Blob}
   */
  static getBlob(content:string, type:string = "txt"):Blob {
    let blob:Blob;
    let mime = 'text/plain';
    switch (type.toLowerCase()){
      case "csv": mime = 'text/csv';
          break;
    }
    blob = new Blob(["\ufeff", content], {type: mime});
    return blob;
  }
  /**
   * Fire the download file
   * @param blob
   * @param nameFile
   */
  static downloadBlob(blob:Blob, nameFile:string):void {
    //[http://lmfresneda.esy.es/javascript/crear-archivo-csv-con-array-de-objecto-en-javascript/]
    let reader = new FileReader();
    let save;
    reader.onload = function (event) {
      save = document.createElement('a');
      save.href = event.target["result"];
      save.target = '_blank';
      save.download = nameFile;
      let clicEvent;
      try {
        clicEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
      } catch (e) {
        clicEvent = document.createEvent("MouseEvent");
        clicEvent.initEvent('click', true, true);
      }
      save.dispatchEvent(clicEvent);
      (window.URL || window["webkitURL"]).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(blob);
  }
}
