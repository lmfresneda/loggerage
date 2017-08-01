# loggerage

[![npm](https://img.shields.io/npm/v/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage) [![npm](https://img.shields.io/npm/dt/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage)

loggerage is a Javascript logger who saves the register directly on localStorage. It also is able to create a .csv or .txt file with the log content. 

## How to use

```
$ npm install --save loggerage
```

```javascript
const { Loggerage, LoggerageLevel } = require("loggerage");

const logger = new Loggerage("MY-APP");
logger.debug("Hello world!");
```

First parameter is the name to identify our application at the localStorage, it means it has to be unique for the logger. We can use a second parameter to indicate the default log level with the help of the **enum LoggerageLevel** (`LoggerageLevel.DEBUG` by default), and a third parameter indicating the logger version (1, by default),

So the logger gives back most of the methods, we can chain calls (chaining):

```javascript
logger.
    debug("Hello world!").
    info("Info message").
    debug("End");
```

## Requirements

loggerage has no any kind of dependences. 

## API

### .setStorage( *otherStorage* ) : *Loggerage*

We can indicate a different storage other than the default one. This new storage must implement Storage interface at the [Web API Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Example:

```javascript
let myNewStorage = {
    key: 			function( key ){ /* ... */ },
    getItem: 		function( keyName ){ /* ... */ },
    setItem: 		function( keyName, keyValue ){ /* ... */ },
    removeItem: 	function( keyName ){ /* ... */ },
    clear: 			function( ){ /* ... */ }
};
logger.setStorage(myNewStorage);
```

Returns the Loggerage object itself.

### .getVersion( ) : *number*

Returns actual version

### .getApp( ) : *string*

Returns app name given at the constructor

### .setDefaultLogLevel( *LoggerageLevel* ) : *Loggerage*

Modifies log default level if we call `.log()` directly 

### .getDefaultLogLevel( ) : *string*

Returns current default log level

### .getLog( ) : *Array\<LoggerageObject\>*

Returns actual log saved at localStorage in an object Array format LoggerageObject, like this:

```javascript
LoggerageObject = {
    date : "string",    //Creation date in Date.toLocaleString() format
    level : "string",   //log level
    message : "string" 	//logged message
}
```

### .clearLog( ) : *Loggerage*

Delete all current log.

### .downloadFileLog( *[type]* ) : *Loggerage*

Download current log file. We can indicate filetype with `"csv"` or `"txt"` parameters for .csv or .txt files. CSV files are separated by ';' and TXT files are separated by tabs

Name file format is:

[ App name ]_[ Date.now() ]_log.[ type ]

Example: `MY-APP_1462995577596_log.txt`

### .info( *message* ) : *Loggerage*

Logs a message with INFO level

### .debug( *message* ) : *Loggerage*

Logs a message with DEBUG level

### .trace( *message* ) : *Loggerage*

Logs a message with TARCE level

### .success( *message* ) : *Loggerage*

Logs a message with SUCCESS level

### .warn( *message* ) : *Loggerage*

Logs a message with WARN level

### .error( *message[, stacktrace]* ) : *Loggerage*

Logs a message with ERROR level. Concats `stacktrace` to message if stacktrace exists

### .failure( *message[, stacktrace]* ) : *Loggerage*

Logs a message with FAILURE level. Concats stacktrace to message if `stacktrace` exists

### .log( *logLevel, message[, stacktrace]* ) : *Loggerage*

Logs a message with given level. Concats stacktrace to message if `stacktrace` exists

## Run test

```bash
$ npm install && npm test
```

## License

* [MIT License](https://opensource.org/licenses/MIT)



