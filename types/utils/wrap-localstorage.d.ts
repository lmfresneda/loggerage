import { LoggerageObject } from '../loggerage-object';
import { Storage } from '../storage-interface';
import { Query } from './query';
export declare class WrapLocalStorage implements Storage {
    private _storage;
    constructor(localStorage: any);
    getItem(app: string, query?: Query): LoggerageObject[];
    setItem(app: string, value: LoggerageObject): void;
    clear(): void;
}
