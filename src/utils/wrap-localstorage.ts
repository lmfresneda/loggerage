
import { LoggerageObject } from '../loggerage-object';
import { Storage } from '../storage-interface';

export class WrapLocalStorage implements Storage {

  private _storage:any;

  constructor(localStorage:any){
    this._storage = localStorage;
  }

  getItem(app:string): Array<LoggerageObject>{
    let logs:Array<LoggerageObject> = JSON.parse(this._storage.getItem(app) || "[]");
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
