## [v1.4.0](https://github.com/lmfresneda/loggerage/releases/tag/1.4.0)

* Separate classes in files
* Separate types in files and other folder
* Improvement storage interface
* Improvement control types
* Wrapped with 'Promise.resolve' calls in async methods

## [v1.3.0](https://github.com/lmfresneda/loggerage/releases/tag/1.3.0)

* Insert app name and version properties in each log
* Accepted version as number or string
* Accepted object at second parameter in constructor, instead defaultLogLevel and version. Although the old form is still accepted for retrocompatibility.

```javascript
Second parameter = {
    isLocalStorage: boolean;            // default true
    silence: boolean = false;           // default false
    version: number|string;             // default 1
    defaultLogLevel: LoggerageLevel;    // default LoggerageLevel.DEBUG;
    storage: any;                       // default null
}
```

Example:

```javascript
const logger = new Loggerage('MY-APP', {
    isLocalStorage: false,
    silence: true,
    version: '1.1'
    defaultLogLevel: LoggerageLevel.INFO,
    storage: myOwnStorage
});
```

**All properties are optionals and the object itself is optional. The default options will be collected.**

## [v1.2.0](https://github.com/lmfresneda/loggerage/releases/tag/1.2.0)

* Implement async methods

## [v1.1.1](https://github.com/lmfresneda/loggerage/releases/tag/1.1.1)

* fixed if not exist window or default localStorage in construction
* added timestamp property to LoggerageObject

## [v1.0.1](https://github.com/lmfresneda/loggerage/releases/tag/1.0.1)

* Fixed bugs and improvement docs

## [v1.0.0](https://github.com/lmfresneda/loggerage/releases/tag/1.0.0)

* Refactor
* Package name changed (old LogStorage.js)

## [v0.2.3](https://github.com/lmfresneda/loggerage/releases/tag/0.2.3)

* First published version
