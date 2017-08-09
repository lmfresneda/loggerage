import { LoggerageObject } from './loggerage-object';
import { Storage } from './storage-interface';
export declare class WrapLocalStorage implements Storage {
    private _storage;
    constructor(localStorage: any);
    getItem(app: string): Array<LoggerageObject>;
    setItem(app: string, value: LoggerageObject): void;
    clear(): void;
}
