import * as moment from 'moment';
import { LoggerageObject } from '../loggerage-object';
import { Loggerage } from '../loggerage';
import { Utils } from './utils';
import { Queriable } from './query';

declare var global: any;

export class Downloadable {
  /**
   * Download the log in a file
   * @param type File type (csv || txt)
   * @returns {Loggerage}
   */
  downloadFileLog(type:string = "txt"):Downloadable{
    if(Blob && (window.URL || window["webkitURL"])) {
      console.info("The file is building now");
      let contenido = "";
      switch (type.toLowerCase()) {
        case "txt":
          contenido = Utils.buildTxtContent(this.getLog());
          break;
        case "csv":
          contenido = Utils.buildCsvContent(this.getLog());
          break;
      }
      let blob = Utils.getBlob(contenido, type);
      let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
      Utils.downloadBlob(blob, nameFile);
    }else {
      throw new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser.");
    }
    this.resetQuery();
    return this;
  }

  /**
   * Download the log in a file
   * @param type     File type (csv || txt) txt by default
   * @param callback    Is a function that recived two params. The first param is an error if occurs, otherwise is null. The second param is blob.
   * @returns {void}
   */
  downloadFileLogAsync(type:string = "txt", callback:(error:Error|void, blob?:Blob) => void):void{
    if(Blob && ((window || global).URL || (window || global)["webkitURL"])) {
      console.info("The file is building now");
      let contenido = "";
      this.getLogAsync((err, logs) => {
        if(err) return callback(err);

        switch (type.toLowerCase()) {
          case "txt":
            contenido = Utils.buildTxtContent(logs);
            break;
          case "csv":
            contenido = Utils.buildCsvContent(logs);
            break;
        }
        let blob = Utils.getBlob(contenido, type);
        let nameFile = this.getApp() + "_" + Date.now() + "_log." + type.toLowerCase();
        Utils.downloadBlob(blob, nameFile);
        this.resetQuery();
        callback(null, blob);
      })
    }else {
      this.resetQuery();
      callback(new Error("Your browser does not support File APIs. Visit http://browsehappy.com for update or your official page browser."));
    }
  }

  getLogAsync: (callback:(error:Error, data?:LoggerageObject[]) => void) => void;
  getLog: () => LoggerageObject[];
  resetQuery: () => Queriable;
  getApp: () => string;
}
