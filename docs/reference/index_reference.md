## Index Reference



### Constructor

This is the constructor interface:

```javascript
constructor(app: string, options?: LoggerageOptions)
```

The **first parameter** is the **app or logger name**. The second parameter is optional, and is a [`LoggerageOptions`](options.md) object, which defines different options for logger (all properties of the options are optionals).

```javascript
const { Loggerage, LoggerageLevel, LoggerageOptions } = require("loggerage");
const myStorage = require('./my-storage');

const options = new LoggerageOptions();
options.version = '1.0';
options.defaultLogLevel = LoggerageLevel.INFO;
options.storage = myStorage;
const logger = new Loggerage("MY-APP", options);
```

[`LoggerageOptions`](options.md) is really a plain object, then, out of 'typescript' scope, you can do this:

```javascript
const logger = new Loggerage("MY-APP", {
    version: '1.0',
    defaultLogLevel: LoggerageLevel.INFO,
    storage: myStorage
});
```



### .setStorage (Change storage)

Declaration:

```javascript
.setStorage( storage: Storage ): Loggerage
```

We can indicate a different storage other than the default one. This new storage must implement the next interface:

```javascript
// file: 'src/storage-interface.ts'

interface Storage {
  getItem(key:string, query?:Query): LoggerageObject[] | Promise<LoggerageObject[]>
  setItem(key:string, value:LoggerageObject): void | Promise<void>
  clear(): void | Promise<void>
}

// 'key' is the name of app or logger, indicated in constructor.
// 'query' is optional.
```

It's similar to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage), but not working with strings in the return of `getItem` and second parameter of `setItem`.

**IMPORTANT**: We recommend returning a promise when we are going to work with [asynchronous methods](../index.md#about_async_methods) of Loggerage, but not is required. The calls to storage methods, inside async methods of Loggerage, are wrapped by `Promise.resolve` always.




### .getVersion

Declaration:

```javascript
.getVersion( ): number|string
```

Returns actual version




### .getApp

Declaration:

```javascript
.getApp( ): string
```

Returns app or logger name given at the constructor




### .setDefaultLogLevel

Declaration:

```javascript
.setDefaultLogLevel( defaultLogLevel: LoggerageLevel ): Loggerage
```

Modifies log default level if we call `.log()` directly




### .getDefaultLogLevel

Declaration:

```javascript
.getDefaultLogLevel( ): string
```

Returns current default log level string, like `INFO`




### .getDefaultLogLevelNumber

Declaration:

```javascript
.getDefaultLogLevelNumber( ): number
```

Returns current default log level number, like `3` for `INFO` level




### .setSilence

Declaration:

```javascript
.setSilence( silence: boolean ): Loggerage
```

Set silence console logs.





### .getSilence

Declaration:

```javascript
.getSilence( ): boole
```

Get actual silence console logs.




### .getLog

Declaration:

```javascript
.getLog( ): LoggerageObject[]
```

Returns the actual log saved at storage in an LoggerageObject Array, like this:

```javascript
// file: src/loggerage-object.ts

LoggerageObject[] = [{
    app: string,            // app or logger name
    version: number|string, // app or logger version
    timestamp: number,      // Created by Date.now()
    date : "string",        // Creation date in Date.toLocaleString() format
    level : "string",       // log level
    level_number : number,  // log level number
    message : "string"      // logged message
}]
```




### .getLogAsync

Declaration:

```javascript
.getLogAsync( callback: (error: Error, data?: LoggerageObject[]) => void ): void
```

Returns asynchronously the actual log saved at storage in an LoggerageObject Array, like the `.getLog( )` method.





### .clearLog

Declaration:

```javascript
.clearLog( ): Loggerage
```

Delete all current log.





### .clearLogAsync

Declaration:

```javascript
.clearLogAsync( callback: (error: Error|void) => void ): void
```

Delete all current log asynchronously





### .downloadFileLog

Declaration:

```javascript
.downloadFileLog( type: string = "txt" ) : Loggerage
```

Download current log file. We can indicate filetype with `"csv"` or `"txt"` parameters for .csv or .txt files. CSV files are separated by ';' and TXT files are separated by tabs

Name file format is:

[ App name ]_[ Date.now() ]_log.[ type ]

Example: `MY-APP_1462995577596_log.txt`




### INSERT LOG METHODS


#### **.info**

Declaration:

```javascript
.info( message: string ): Loggerage
```

Logs a message with INFO level




#### **.infoAsync**

Declaration:

```javascript
.infoAsync( message: string, callback: (error: Error|void) => void ): void
```

Logs a message with INFO level asynchronously





#### **.debug**

Declaration:

```javascript
.debug( message: string ): Loggerage
```

Logs a message with DEBUG level





#### **.debugAsync**

Declaration:

```javascript
.debugAsync( message: string, callback: (error: Error|void) => void ): void
```

Logs a message with DEBUG level asynchronously





#### **.trace**

Declaration:

```javascript
.trace( message: string ): Loggerage
```

Logs a message with TRACE level





#### **.traceAsync**

Declaration:

```javascript
.traceAsync( message: string, callback: (error: Error|void) => void ): void
```

Logs a message with TRACE level asynchronously





#### **.success**

Declaration:

```javascript
.trace( message: string ): Loggerage
```

Logs a message with SUCCESS level





#### **.successAsync**

Declaration:

```javascript
.successAsync( message: string, callback: (error: Error|void) => void ): void
```

Logs a message with SUCCESS level asynchronously





#### **.warn**

Declaration:

```javascript
.warn( message: string ): Loggerage
```

Logs a message with WARN level





#### **.warnAsync**

Declaration:

```javascript
.warnAsync( message: string, callback: (error: Error|void) => void ): void
```

Logs a message with WARN level asynchronously





#### **.error**

Declaration:

```javascript
.error( message: string, stacktrace?:string ): Loggerage
```

Logs a message with ERROR level. Concats `stacktrace` to message if stacktrace exists





#### **.errorAsync**

Declaration:

```javascript
.errorAsync( message: string, stacktrace:string, callback: (error: Error|void) => void ): void
```

Logs a message with ERROR level asynchronously. Concats stacktrace to message. `stacktrace` is required.





#### **.failure**

Declaration:

```javascript
.failure( message: string, stacktrace?:string ): Loggerage
```

Logs a message with FAILURE level. Concats `stacktrace` to message if stacktrace exists





#### **.failureAsync**

Declaration:

```javascript
.failureAsync( message: string, stacktrace:string, callback: (error: Error|void) => void ): void
```

Logs a message with FAILURE level. Concats stacktrace to message if `stacktrace` exists





#### **.log**

Declaration:

```javascript
.log( logLevel: LoggerageLevel = defaultLogLevel, message: string, stacktrace?: string ): Loggerage
```

Logs a message with given level. Concats stacktrace to message if `stacktrace` exists





#### **.logAsync**

Declaration:

```javascript
.logAsync( logLevel: LoggerageLevel = defaultLogLevel, message: string, stacktrace: string, callback: (error: Error|void) => void ): void
```

Logs a message with given level asynchronously. Concats stacktrace to message if `stacktrace` exists, which can be null.
