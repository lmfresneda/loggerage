import { LoggerageObject } from './loggerage-object';
export interface Storage {
    getItem(app: string): Array<LoggerageObject> | Promise<Array<LoggerageObject>>;
    setItem(app: string, value: LoggerageObject): void | Promise<void>;
    clear(): void | Promise<void>;
}
