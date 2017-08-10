import { LoggerageObject } from './loggerage-object';
import { Query } from './utils/query';

export interface Storage {
  getItem(app:string, query?:Query): LoggerageObject[]|Promise<LoggerageObject[]>
  setItem(app:string, value:LoggerageObject):void|Promise<void>
  clear():void|Promise<void>
}
