## loggerage

[![npm](https://img.shields.io/npm/v/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage) [![npm](https://img.shields.io/npm/dt/loggerage.svg?style=flat-square)](https://www.npmjs.com/package/loggerage) ![Love](https://img.shields.io/badge/love-max-brightgreen.svg?style=flat-square) [![Travis](https://img.shields.io/travis/lmfresneda/loggerage.svg?style=flat-square)](https://travis-ci.org/lmfresneda/loggerage) [![Coveralls](https://img.shields.io/coveralls/lmfresneda/loggerage.svg?style=flat-square)](https://coveralls.io/github/lmfresneda/loggerage)

loggerage is a Javascript logger who saves the register directly on localStorage or your own storage if you want. It also is able to create a .csv or .txt file with the log content.

### How to use

```
$ npm install --save loggerage
```

```javascript
const { Loggerage, LoggerageLevel } = require("loggerage");

const logger = new Loggerage("MY-APP");
logger.debug("Hello world!");
```

First parameter is the name to identify our application, it means it has to be unique for the logger. This construction will use the default 'localStorage'. [See constructor explanation](reference/index_reference.md#constructor) for more options

So the logger gives back most of the methods, we can chain calls (chaining) in sync methods:

```javascript
logger.
    debug("Hello world!").
    info("Info message").
    debug("End");
```

### Reference

You have a complete reference on [this page](reference/index_reference.md)

### About async methods

All async methods require a callback parameter that recive at first parameter an error if occurs, and in the second parameter recive data if is neccesary, like a log for example.

```javascript
logger.getLogAsync((err, log) => {
  if(null != err) return handleError(err);

  console.log(log); // OK!
});
```

**IMPORTANT**: We recommend returning a promise in storage methods when we are going to work with asynchronous methods of Loggerage, but not is required. The calls to storage methods, inside async methods of Loggerage, are wrapped by `Promise.resolve` always.

### Convert async methods to Promises

Now you can use the [`loggerage-promisify`](https://github.com/lmfresneda/loggerage-promisify) helper for promisify methods. You can promisify the methods with `Async` suffix or promisify **all methods**.

Example:

```javascript
const { Loggerage } = require("loggerage");
const promisify = require('loggerage-promisify')

const logger = promisify(new Loggerage("MY-APP"));

logger.debug("Hello world!") // is a promise now!
  .then(() => {
    return logger.getLog();
  })
  .then((log) => {
    // handle log!
  })
  .catch(handleError);
```

See [`loggerage-promisify`](https://github.com/lmfresneda/loggerage-promisify) for more information.

### Contributing

* [See contributing page](contributing.md)

### License

* [See MIT License](license.md)




