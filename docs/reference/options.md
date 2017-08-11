## LoggerageOptions

This is the options object for [constructor](index_reference.md#constructor).

```javascript
// file: src/loggerage-options.ts
```

(all properties of the options are optionals).


Property | Type | Default | Description
--- | --- | --- | ---
isLocalStorage | `boolean` | `true` | Indicate if storage is the default localStorage
silence | `boolean` | `false` | If true, will not be displayed console logs
version | `number or string` | `1` | Version logger/application
defaultLogLevel | `LoggerageLevel` | `LoggerageLevel.DEBUG` | Default level log
storage | `object` | `null` | Our own storage, instead default localStorage. If set, `isLocalStorage` property set to false automatically


## LoggerageLevel

This is the enum util for indicate log level:

```javascript
// file: src/loggerage-level.ts

enum LoggerageLevel {
  DEBUG,
  TRACE,
  SUCCESS,
  INFO,
  WARN,
  ERROR,
  FAILURE
}
```
