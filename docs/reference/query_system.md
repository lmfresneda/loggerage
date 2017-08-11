## Query System

You can get the log by applying a filter. In the default localStorage, the log is return filtered by the query. In the custom storages, the query is passed in second parameter of `getItem` method, **only if a query is required**. Example of query:

```javascript
const { Loggerage, LoggerageLevel } = require("loggerage");

const logger = new Loggerage("MY-APP");
logger.info('Info log');
logger.debug('Debug log');
const log = logger.level(LoggerageLevel.INFO).getLog();

// log = [{ level: 'INFO', level_number: 3, message: 'Info log' ... }];
```

These query system also apply for the `getLogAsync` method.

**Query methods**:

* `.from( from: Moment|Date|string|number, dateStringFormat?: string )`:
* `.to( from: Moment|Date|string|number, dateStringFormat?: string )`:

From and To methods, receives one of `Moment|Date|string|number` type, and if the date is passed in `string` type, we can provide a [*moment* format](https://momentjs.com/docs/#/parsing/string-format/). The format by default for string dates is `YYYY-MM-DD HH:mm:ss.SSS`. Number is a unix timestamp (in [milliseconds](https://momentjs.com/docs/#/parsing/unix-timestamp-milliseconds/))

* `.version( version: number|string )`:

Recieve the version of app or logger. Remember that diferents loggers can be with the same name, but different version.

* `.level( level: LoggerageLevel|LoggerageLevel[] )`:

Recieve one or some levels to filter.

* `.app( app: string )`:

Recieve the app or logger name. It's mainly made for custom storages, because with the default localStorage, the log is filtered by app name always.

**Complete example**:

```javascript
const { Loggerage, LoggerageLevel, LoggerageOptions } = require("loggerage");

const opt1 = new LoggerageOptions();
opt1.version = '1.0';
const opt2 = new LoggerageOptions();
opt2.version = '2.0';

const logger1 = new Loggerage("MY-APP", opt1);
const logger2 = new Loggerage("MY-APP", opt2);

logger1.info('Info log 1');   // LOGGER 1
logger1.info('Info log 2');   // LOGGER 1
logger1.debug('Debug log 1'); // LOGGER 1

// after 5 seconds

logger1.debug('Debug log 2'); // LOGGER 1
logger2.info('Info log 2');   // LOGGER 2
logger2.debug('Debug log 3'); // LOGGER 2

const logs1 = logger1
                .from(moment().subtract(6, 'seconds'))
                .to(moment().subtract(4, 'seconds'))
                .level(LoggerageLevel.INFO)
                .version('1.0') // this is not necessary in this case, but don't care
                .getLog();

// [logs1] include only 'Info log 1' and 'Info log 2' logs

logger2.from(moment().subtract(2, 'second')).getLogAsync(function(err, logs2) {
  // It's asynchronous just to see that it works with this method too

  // [logs2] include only 'Debug log 2', 'Info log 2' and 'Debug log 3' logs
  // include one log of 'logger1' because the two use the same app name, use the default localStorage and no is filtered by version
});
```
