# LogStorage.js

[![npm](https://img.shields.io/npm/v/LogStorage.js.svg?style=flat-square)](https://www.npmjs.com/package/LogStorage.js) [![npm](https://img.shields.io/npm/dt/LogStorage.js.svg?style=flat-square)](https://www.npmjs.com/package/LogStorage.js)

LogStorage.js is a Javascript logger who saves the register directly on localStorage. It also is able to create a .csv or .txt file with the log content. 

## How to use

### Browser

[Download project](https://github.com/lmfresneda/LogStorage.js/archive/master.zip "Download project")

Menction our webpage at the script

```html
<script type="text/javascript" src="build/LogStorage.js"></script>
```

To use it we need to create an instance at the logger:

```javascript
let logger = new LogStorageJS("MY-APP");
logger.debug("Hello world!");
```

### npm

```
$ npm install LogStorage.js --save
```

```javascript
let LogStorageJS = require("LogStorage.js").LogStorageJS;
let logger = new LogStorageJS("MY-APP");
logger.debug("Hello world!");
```

First parameter is the name to identify our application at the localStorage, it means it has to be unique for the logger. We can use a second parameter to indicate the default log level(`LogStorageJSLevel.DEBUG` by default), and a third parameter indicating the logger version (1, by default),

So the logger gives back most of the methods, we can chain calls (chaining):

```javascript
logger.
    debug("Hello world!").
    info("Info message").
    debug("End");
```

## Requirements

LogStorage.js has no any kind of dependences. 

## API

### .setStorage( *otherStorage* ) : *LogStorageJS*

We can indicate a different storage other than the default one. This new storage must implement Storage interface at the Web API Storage. Example:

```javascript
let miNuevoStorage = {
    key: 			function( key ){ /* ... */ },
    getItem: 		function( keyName ){ /* ... */ },
    setItem: 		function( keyName, keyValue ){ /* ... */ },
    removeItem: 	function( keyName ){ /* ... */ },
    clear: 			function( ){ /* ... */ }
};
logger.setStorage(miNuevoStorage);
```

Returns the LogStorageJS object itself.

### .getVersion( ) : *number*

Returns actual version

### .getApp( ) : *string*

Returns app name given at the constructor

### .setDefaultLogLevel( *defaultLogLevel* ) : *LogStorageJS*

Modifies log default level if we call `.log()` directly 

### .getDefaultLogLevel( ) : *string*

Returns current default log level

### .getLog( ) : *Array\<LogStorageObject\>*

Returns actual log saved at localStorage in an object Array format LogStorageJSObject, like this:

```javascript
LogStorageJSObject = {
    date : "string", 		//Creation date in Date.toLocaleString() format
        level : "string", 		//log level
        message : "string" 	//logged message
}
```

### .clearLog( ) : *LogStorageJS*

Delete all current log.

### .downloadFileLog( *[type]* ) : *LogStorageJS*

Download current log file. We can indicate filetype with `"csv"` or `"txt"` parameters for .csv or .txt files. CSV files are separated by ';' and TXT files are separated by tabs

Name file format is:

[ App name ]_[ Date.now() ]_log.[ type ]

Example: `MY-APP_1462995577596_log.txt`

### .info( *message* ) : *LogStorageJS*

Logs a message with INFO level

### .debug( *message* ) : *LogStorageJS*

Logs a message with DEBUG level

### .trace( *message* ) : *LogStorageJS*

Logs a message with TARCE level

### .success( *message* ) : *LogStorageJS*

Logs a message with SUCCESS level

### .warn( *message* ) : *LogStorageJS*

Logs a message with WARN level

### .error( *message[, stacktrace]* ) : *LogStorageJS*

Logs a message with ERROR level. Concats `stacktrace` to message if stacktrace exists

### .failure( *message[, stacktrace]* ) : *LogStorageJS*

Logs a message with FAILURE level. Concats stacktrace to message if `stacktrace` exists

### .log( *logLevel, message[, stacktrace]* ) : *LogStorageJS*

Logs a message with given level. Concats stacktrace to message if `stacktrace` exists


## License

* [MIT License](https://opensource.org/licenses/MIT)



