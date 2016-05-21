#LogStorage.js

LogStorage.js es un logger para Javascript que guarda el registro directamente en el localStorage. Además, tiene la capacidad de poder crear un archivo `.csv` o `.txt` con el contenido del log.

##Cómo usar

###Navegador

[Descargar proyecto](https://github.com/lmfresneda/LogStorage.js/archive/master.zip "Descargar proyecto")

Referenciar en nuestra página el script 

```html
<script type="text/javascript" src="build/LogStorage.js"></script>
```

Para hacer uso deberemos crear una instancia del logger:

```javascript
let logger = new LogStorageJS("MI-APP");
logger.debug("Hola Mundo!");
```

###npm

```
$ npm install LogStorage.js --save
```

```javascript
let LogStorageJS = require("LogStorage.js").LogStorageJS;
let logger = new LogStorageJS("MI-APP");
logger.debug("Hola Mundo!");
```

El primer parámetro es un nombre que identifique nuestra aplicación dentro del localStorage, es decir, debería ser un nombre único para el logger. Podemos pasarle un segundo parámetro para indicar el nivel de log por defecto (si no lo pasamos, por defecto será `LogStorageJSLevel.DEBUG`) y un tercer parámetro que será la versión del logger (por defecto 1),

Al devolver la mayoría de métodos el propio logger, podremos encadenar llamadas:

```javascript
logger.
    debug("Hola Mundo!").
    info("Mensaje de información").
    debug("Termino");
```

##Requerimientos

LogStorage.js no tiene dependencias de ningún tipo. 

##API

###.setStorage( *otherStorage* ) : *LogStorageJS*

Tendremos la capacidad de indicar un storage diferente en lugar del localStorage por defecto. Este nuevo storage debe implementar la interface `Storage` de la *[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage "Web Storage API")*. Ejemplo:

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

Retorna el propio objeto LogStorageJS.

###.getVersion( ) : *number*

Devuelve la actual versión

###.getApp( ) : *string*

Devuelve el nombre de la app indicado en el constructor

###.setDefaultLogLevel( *defaultLogLevel* ) : *LogStorageJS*

Modifica el nivel de log por defecto si llamamos directamente a `.log()`

###.getDefaultLogLevel( ) : *string*

Devuelve el nivel de log por defecto actual

###.getLog( ) : *Array\<LogStorageObject\>*

Devuelve el log actual guardado en localStorage en formato Array de objetos LogStorageJSObject, el cual es del tipo:

```javascript
LogStorageJSObject = {
    date : "string", 		//fecha de creación en formato Date.toLocaleString()
        level : "string", 		//nivel de log
        message : "string" 	//mensaje logueado
}
```

###.clearLog( ) : *LogStorageJS*

Borra todo el log actual.

###.downloadFileLog( *[type]* ) : *LogStorageJS*

Descarga a un fichero el log actual. Podemos indicarle el tipo de fichero pasándole `"csv"` para crear un archivo en formato CSV o `"txt"` para crearlo en formato txt, en este último caso los datos de cada línea de log irán separados por tabulaciones, y en el caso de CSV irán por `";"`.

El formato del nombre del fichero será:

[ Nombre de la app ]_[ Date.now() ]_log.[ type ]

Por ejemplo: `MI-APP_1462995577596_log.txt`

###.info( *message* ) : *LogStorageJS*

Loguea un mensaje con nivel INFO

###.debug( *message* ) : *LogStorageJS*

Loguea un mensaje con nivel DEBUG

###.trace( *message* ) : *LogStorageJS*

Loguea un mensaje con nivel TRACE

###.success( *message* ) : *LogStorageJS*

Loguea un mensaje con nivel SUCCESS

###.warn( *message* ) : *LogStorageJS*

Loguea un mensaje con nivel WARN

###.error( *message[, stacktrace]* ) : *LogStorageJS*

Loguea un mensaje con nivel ERROR. Concatena al mensaje el `stacktrace` si existe

###.failure( *message[, stacktrace]* ) : *LogStorageJS*

Loguea un mensaje con nivel FAILURE. Concatena al mensaje el `stacktrace` si existe

###.log( *logLevel, message[, stacktrace]* ) : *LogStorageJS*

Loguea un mensaje con el nivel indicado. Concatena al mensaje el `stacktrace` si existe


##Licencia

* [MIT License](https://opensource.org/licenses/MIT)



