# loggerage

[![npm](https://img.shields.io/npm/v/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage) [![npm](https://img.shields.io/npm/dt/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage) ![Love](https://img.shields.io/badge/love-max-brightgreen.svg?style=flat-square) [![Travis](https://img.shields.io/travis/lmfresneda/hashtagfy.svg?style=flat-square)](https://travis-ci.org/lmfresneda/hashtagfy)

loggerage is a Javascript logger who saves the register directly on localStorage or your own storage if you want. It also is able to create a .csv or .txt file with the log content.

* [How to use](#how-to-use)
* [API](#api)
    * [Constructor](#constructor)
    * [(setStorage) How to change default storage](#setstorage)
    * [(getVersion)](#getversion)
    * [(getApp)](#getapp)
    * [(setDefaultLogLevel) How to change default log level](#setdefaultloglevel)
    * [(getDefaultLogLevel)](#getdefaultloglevel)
    * [(getDefaultLogLevelNumber)](#getdefaultloglevelnumber)
    * [(setSilence)](#setsilence)
    * [(getSilence)](#getsilence)
    * [(getLog) How to get log stored](#getlog)
    * [(getLogAsync) How to get log asynchronously](#getlogasync)
    * [(clearLog) How to clear log stored](#clearlog)
    * [(clearLogAsync) How to clear log asynchronously](#clearlogasync)
    * [(downloadFileLog) How to download file with a log stored](#downloadfile)
    * [INSERT LOG METHODS](#info)
* [LoggerageOptions](#loggerageoptions)
* [(Async) Things about async methods](#async)
* [Convert async methods to Promises](#async-to-promises)
* [Contributing](#contributing)
* [Run test](#run-test)
* [License](#license)

## <a name="how-to-use"></a>How to use

```
$ npm install --save loggerage
```

```javascript
const { Loggerage, LoggerageLevel } = require("loggerage");

const logger = new Loggerage("MY-APP");
logger.debug("Hello world!");
```

First parameter is the name to identify our application, it means it has to be unique for the logger. This construction will use the default 'localStorage'. [See constructor explanation](#constructor) for more options

So the logger gives back most of the methods, we can chain calls (chaining) in sync methods:

```javascript
logger.
    debug("Hello world!").
    info("Info message").
    debug("End");
```

## <a name="api"></a>API

### <a name="constructor"></a>Constructor

This is the constructor interface:

```javascript
constructor(app:string, options?:LoggerageOptions)
```

The **first parameter** is the **app or logger name**. The second parameter is optional, and is a [`LoggerageOptions`](#loggerageoptions) object, which defines different options for logger (all properties of the options are optionals).

```javascript
const { Loggerage, LoggerageLevel, LoggerageOptions } = require("loggerage");
const myStorage = require('./my-storage');

const options = new LoggerageOptions();
options.version = '1.0';
options.defaultLogLevel = LoggerageLevel.INFO;
options.storage = myStorage;
const logger = new Loggerage("MY-APP", options);
```

`LoggerageOptions` is really a plain object, then, out of 'typescript' scope, you can do this:

```javascript
const logger = new Loggerage("MY-APP", {
    version: '1.0',
    defaultLogLevel: LoggerageLevel.INFO,
    storage: myStorage
});
```

### <a name="setstorage"></a>.setStorage( *otherStorage* ) : *Loggerage*

We can indicate a different storage other than the default one. This new storage must implement the next interface:

```javascript
// file: 'src/storage-interface.ts'

interface Storage {
  getItem(key:string): Array<LoggerageObject> | Promise<Array<LoggerageObject>>
  setItem(key:string, value:LoggerageObject): void | Promise<void>
  clear(): void | Promise<void>
}

// 'key' is the name of app or logger, indicated in constructor
```

It's similar to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage), but not working with strings in the return of `getItem` and second parameter of `setItem`.

**IMPORTANT**: We recommend returning a promise when we are going to work with [asynchronous methods](#async) of Loggerage, but not is required. The calls to storage methods, inside async methods of Loggerage, are wrapped by `Promise.resolve` always.

### <a name="getversion"></a>.getVersion( ) : *number*

Returns actual version

### <a name="getapp"></a>.getApp( ) : *string*

Returns app name given at the constructor

### <a name="setdefaultloglevel"></a>.setDefaultLogLevel( *LoggerageLevel* ) : *Loggerage*

Modifies log default level if we call `.log()` directly

### <a name="getdefaultloglevel"></a>.getDefaultLogLevel( ) : *string*

Returns current default log level string, like `INFO`

### <a name="getdefaultloglevelnumber"></a>.getDefaultLogLevelNumber( ) : *number*

Returns current default log level number, like `3` for `INFO` level

### <a name="setsilence"></a>.setSilence( *silence* ) : *Loggerage*

Set silence console logs.

### <a name="getsilence"></a>.getSilence( ) : *boolean*

Get actual silence console logs.

### <a name="getlog"></a>.getLog( ) : *Array\<LoggerageObject\>*

Returns the actual log saved at storage in an LoggerageObject Array, like this:

```javascript
// file: src/loggerage-object.ts

LoggerageObject = {
    app: string,            // app or logger name
    version: number|string, // app or logger version
    timestamp: number,      // Created by Date.now()
    date : "string",        // Creation date in Date.toLocaleString() format
    level : "string",       // log level
    message : "string"      // logged message
}
```

### <a name="getlogasync"></a>.getLogAsync( *callback* ) : *void*

Returns asynchronously the actual log saved at storage in an LoggerageObject Array, like the `.getLog( )` method.

### <a name="clearlog"></a>.clearLog( ) : *Loggerage*

Delete all current log.

### <a name="clearlogasync"></a>.clearLogAsync( *callback* ) : *void*

Delete all current log asynchronously

### <a name="downloadfile"></a>.downloadFileLog( *[type]* ) : *Loggerage*

Download current log file. We can indicate filetype with `"csv"` or `"txt"` parameters for .csv or .txt files. CSV files are separated by ';' and TXT files are separated by tabs

Name file format is:

[ App name ]_[ Date.now() ]_log.[ type ]

Example: `MY-APP_1462995577596_log.txt`

### <a name="info"></a>.info( *message* ) : *Loggerage*

Logs a message with INFO level

### <a name="infoasync"></a>.infoAsync( *message, callback* ) : *void*

Logs a message with INFO level asynchronously

### <a name="debug"></a>.debug( *message* ) : *Loggerage*

Logs a message with DEBUG level

### <a name="debugasync"></a>.debugAsync( *message, callback* ) : *void*

Logs a message with DEBUG level asynchronously

### <a name="trace"></a>.trace( *message* ) : *Loggerage*

Logs a message with TRACE level

### <a name="traceasync"></a>.traceAsync( *message, callback* ) : *void*

Logs a message with TRACE level asynchronously

### <a name="success"></a>.success( *message* ) : *Loggerage*

Logs a message with SUCCESS level

### <a name="successasync"></a>.successAsync( *message, callback* ) : *void*

Logs a message with SUCCESS level asynchronously

### <a name="warn"></a>.warn( *message* ) : *Loggerage*

Logs a message with WARN level

### <a name="warnasync"></a>.warnAsync( *message, callback* ) : *void*

Logs a message with WARN level asynchronously

### <a name="error"></a>.error( *message[, stacktrace]* ) : *Loggerage*

Logs a message with ERROR level. Concats `stacktrace` to message if stacktrace exists

### <a name="errorasync"></a>.errorAsync( *message, stacktrace, callback* ) : *void*

Logs a message with ERROR level asynchronously. Concats stacktrace to message if `stacktrace` exists, which can be null.

### <a name="failure"></a>.failure( *message[, stacktrace]* ) : *Loggerage*

Logs a message with FAILURE level. Concats stacktrace to message if `stacktrace` exists

### <a name="failureasync"></a>.failureAsync( *message, stacktrace, callback* ) : *void*

Logs a message with FAILURE level asynchronously. Concats stacktrace to message if `stacktrace` exists, which can be null.

### <a name="log"></a>.log( *logLevel, message[, stacktrace]* ) : *Loggerage*

Logs a message with given level. Concats stacktrace to message if `stacktrace` exists

### <a name="logasync"></a>.logAsync( *logLevel, message, stacktrace, callback* ) : *void*

Logs a message with given level asynchronously. Concats stacktrace to message if `stacktrace` exists, which can be null.

## <a name="loggerageoptions"></a>LoggerageOptions

```javascript
// file: src/loggerage-options.ts
```

Property | Type | Default | Description
--- | --- | --- | ---
isLocalStorage | `boolean` | `true` | Indicate if storage is the default localStorage
silence | `boolean` | `false` | If true, will not be displayed console logs
version | `number or string` | `1` | Version logger/application
defaultLogLevel | `LoggerageLevel` | `LoggerageLevel.DEBUG` | Default level log
storage | `object` | `null` | Our own storage, instead default localStorage. If set, `isLocalStorage` property set to false automatically

## <a name="async"></a>Async

All async methods require a callback parameter that recive at first parameter an error if occurs, and in the second parameter recive data if is neccesary, like a log for example.

```javascript
logger.getLogAsync((err, log) => {
  if(null != err) return handleError(err);

  console.log(log); // OK!
});
```

**IMPORTANT**: We recommend returning a promise in storage methods when we are going to work with [asynchronous methods](#async) of Loggerage, but not is required. The calls to storage methods, inside async methods of Loggerage, are wrapped by `Promise.resolve` always.

## <a name="async-to-promises"></a>Convert async methods to Promises

All async methods are promisifables, this means that, with the help of libraries like [`es6-promisify`](https://www.npmjs.com/package/es6-promisify) or [`promisify-node`](https://www.npmjs.com/package/promisify-node), you can convert the methods to promises:

```javascript
const promisify = require('promisify-node');
const { Loggerage } = require("loggerage");

const logger = new Loggerage("MY-APP");
logger.infoAsync = promisify(logger.infoAsync);

logger.infoAsync("Hello world!").then(() => {
  // OK!
}).catch((err) => {
  // KO
});
```

## <a name="contributing"></a>Contributing

If you want to contribute, [check this](CONTRIBUTING.md)

## <a name="run-test"></a>Run test

```bash
$ npm install && npm test
```

## <a name="license"></a>License

* [MIT License](https://opensource.org/licenses/MIT)




