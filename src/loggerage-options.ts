import { LoggerageLevel } from './loggerage-level';
import { Storage } from './storage-interface';

/**
 * Options for Loggerage constructor
 */
export class LoggerageOptions {
  /**
   * Indicate if storage is default localStorage.
   * @default true
   * @type {boolean}
   */
  isLocalStorage:boolean = true;
  /**
   * If true, will not be displayed console logs
   * @default false
   * @type {boolean}
   */
  silence:boolean = false;
  /**
   * Version aplicatton
   * @default 1
   * @type {Number|String}
   */
  version:number|string = 1;
  /**
   * Default log level if call .log() method directly
   * @default LoggerageLevel.DEBUG
   * @type {LoggerageLevel}
   */
  defaultLogLevel:LoggerageLevel = LoggerageLevel.DEBUG;
  /**
   * Storage to use. Should implement 'getItem' and 'setItem' of Storage interface
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
   * @type {Storage}
   */
  storage:Storage;
}
