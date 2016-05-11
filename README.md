#LogStorage.js 

LogStorage.js es un logger para Javascript que guarda el registro directamente en el localStorage. Además, tiene la capacidad de poder crear un archivo `.csv` o `.txt` con el contenido del log.

##Cómo usar

###[Descargar proyecto](https://github.com/lmfresneda/LogStorage.js/archive/master.zip "Descargar proyecto")

Referenciar en nuestra página el script 

```html
	<script type="text/javascript" src="build/LogStorage.js"></script>
```

Para hacer uso deberemos crear una instancia del logger:

```javascript
	var logger = new LogStorage("MI-APP");
	logger.debug("Hola Mundo!");
```

El primer parámetro es un nombre que identifique nuestra aplicación dentro del localStorage, es decir, debería ser un nombre único para el logger. Podemos pasarle un segundo parámetro para indicar el nivel de log por defecto (si no lo pasamos, por defecto será `LogStorageLevel.DEBUG`) y un tercer parámetro que será la versión del logger (por defecto 1),

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

###.setStorage( *otherStorage* ) : *LogStorage*

Tendremos la capacidad de indicar un storage diferente en lugar del localStorage por defecto. Este nuevo storage debe implementar la interface `Storage` de la *[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage "Web Storage API")*. Ejemplo:

```javascript
	var miNuevoStorage = {
		key: 			function( key ){ /* ... */ },
		getItem: 		function( keyName ){ /* ... */ },
		setItem: 		function( keyName, keyValue ){ /* ... */ },
		removeItem: 	function( keyName ){ /* ... */ },
		clear: 			function( ){ /* ... */ }
	};
	logger.setStorage(miNuevoStorage);
```

Retorna el propio objeto LogStorage.

###.getVersion( ) : *number*

Devuelve la actual versión

###.getApp( ) : *string*

Devuelve el nombre de la app indicado en el constructor

###.setDefaultLogLevel( *defaultLogLevel* ) : *LogStorage*

Modifica el nivel de log por defecto si llamamos directamente a `.log()`

###.getDefaultLogLevel( ) : *string*

Devuelve el nivel de log por defecto actual

###.getLog( ) : *Array\<LogStorageObject\>*

Devuelve el log actual guardado en localStorage en formato Array de objetos LogStorageObject, el cual es del tipo:

```javascript
	LogStorageObject = {
		date : "string", 		//fecha de creación en formato Date.toLocaleString()
    		level : "string", 		//nivel de log
    		message : "string" 	//mensaje logueado
	}
```

###.clearLog( ) : *LogStorage*

Borra todo el log actual.

###.downloadFileLog( *[type]* ) : *LogStorage*

Descarga a un fichero el log actual. Podemos indicarle el tipo de fichero pasándole `"csv"` para crear un archivo en formato CSV o `"txt"` para crearlo en formato txt, en este último caso los datos de cada línea de log irán separados por tabulaciones, y en el caso de CSV irán por `";"`.

El formato del nombre del fichero será:

[ Nombre de la app ]_[ Date.now() ]_log.[ type ]

Por ejemplo: `MI-APP_1462995577596_log.txt`

###.info( *message* ) : *LogStorage*

Loguea un mensaje con nivel INFO

###.debug( *message* ) : *LogStorage*

Loguea un mensaje con nivel DEBUG

###.trace( *message* ) : *LogStorage*

Loguea un mensaje con nivel TRACE

###.success( *message* ) : *LogStorage*

Loguea un mensaje con nivel SUCCESS

###.warn( *message* ) : *LogStorage*

Loguea un mensaje con nivel WARN

###.error( *message[, stacktrace]* ) : *LogStorage*

Loguea un mensaje con nivel ERROR. Concatena al mensaje el `stacktrace` si existe

###.failure( *message[, stacktrace]* ) : *LogStorage*

Loguea un mensaje con nivel FAILURE. Concatena al mensaje el `stacktrace` si existe

###.log( *logLevel, message[, stacktrace]* ) : *LogStorage*

Loguea un mensaje con el nivel indicado. Concatena al mensaje el `stacktrace` si existe







