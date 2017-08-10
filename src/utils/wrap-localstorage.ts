import * as moment from 'moment';
import { LoggerageObject } from '../loggerage-object';
import { Storage } from '../storage-interface';
import { Utils } from './utils';
import { Query } from './query';

export class WrapLocalStorage implements Storage {

  private _storage:any;

  constructor(localStorage:any){
    this._storage = localStorage;
  }

  getItem(app:string, query?:Query): LoggerageObject[]{
    let logs:LoggerageObject[] = JSON.parse(this._storage.getItem(app) || "[]");

    if(query) logs = Utils.getLogFiltered(logs, query);

    return logs;
  }

  setItem(app:string, value:LoggerageObject):void{
    const logs = this.getItem(app);

    logs.push(value);
    this._storage.setItem(app, JSON.stringify(logs));
  }

  clear():void {
    this._storage.clear();
  }
}
