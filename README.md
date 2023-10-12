## Funciones Serverless λ para consumir la API de Swapi Star Wars 🌌

Este proyecto implementa dos funciones Serverless Lambda para interactuar con la API de Swapi Star Wars y una base de datos. A continuación, se describen estas funciones junto con instrucciones para ejecutar pruebas unitarias y desplegar el servicio localmente y en la nube.

### Función `swapiPost` - Guardar Datos desde SWAPI

Esta función Lambda se encarga de obtener datos de la API de Swapi Star Wars y guardarlos en una base de datos. Utiliza una solicitud HTTP POST para recibir el nombre del modelo de datos que se desea guardar.

**Descripción:**

- **Método HTTP:** POST
- **Ruta:** `/swapi`
- **Parámetros de entrada:**
  - `model` (en el cuerpo de la solicitud): El nombre del modelo de datos que se desea guardar en la base de datos. Debe ser uno de los siguientes: "people", "planets", "films", "species", "vehicles", "starships".
- **Variables de entorno utilizadas:**
  - `DATABASE_URL`: URL de la base de datos donde se guardarán los datos.

**Comportamiento:**

1. La función comprueba si se ha proporcionado un nombre de modelo válido en la solicitud.
2. Si el modelo es válido, crea una tabla en la base de datos si aún no existe.
3. Obtiene datos de la API de Swapi Star Wars para el modelo especificado.
4. Traduce los datos obtenidos al español.
5. Guarda los datos traducidos en la base de datos.
6. Retorna una respuesta HTTP 200 con un mensaje de éxito si la operación se realiza correctamente.
7. En caso de errores, devuelve una respuesta HTTP 500 con un mensaje de error.

### Función `swapiGet` - Obtener Datos desde SWAPI

Esta función Lambda se encarga de obtener datos desde la API de Swapi Star Wars y desde una base de datos. Utiliza una solicitud HTTP GET para recibir el nombre del modelo de datos que se desea obtener.

**Descripción:**

- **Método HTTP:** GET
- **Ruta:** `/swapi/{model}`
- **Parámetros de entrada:**
  - `model` (en la URL): El nombre del modelo de datos que se desea obtener. Debe ser uno de los siguientes: "people", "planets", "films", "species", "vehicles", "starships".
- **Variables de entorno utilizadas:**
  - `DATABASE_URL`: URL de la base de datos de donde se recuperan los datos.

**Comportamiento:**

1. La función obtiene el nombre del modelo desde los parámetros de la solicitud. Si no se proporciona, se utiliza "films" como valor predeterminado.
2. Verifica si el modelo es válido.
3. Crea una tabla en la base de datos si aún no existe.
4. Obtiene datos de la API de Swapi Star Wars para el modelo especificado.
5. Obtiene datos de la base de datos para el mismo modelo.
6. Prepara una respuesta con los datos obtenidos de Swapi y de la base de datos, así como el evento de la solicitud.
7. Retorna una respuesta HTTP 200 con la respuesta preparada.
8. En caso de errores, devuelve una respuesta HTTP 500 con un mensaje de error.

### Documentación Swagger

Para mostrar la documentación en su navegador, ejecute:
```bash
npx tsx app.ts
```

### Ejecución de Pruebas Unitarias 🧪

Para ejecutar las pruebas unitarias, asegúrate de tener Jest instalado. Utiliza el siguiente comando:

```bash
npx jest --config jest.config.js
```

### Despliegue Local 🖥️

Puedes desplegar localmente tus funciones Serverless utilizando Serverless Framework. Para desplegar la función `swapiPost` localmente, utiliza el siguiente comando:

```bash
npx serverless invoke local -f swapiPost --path data.json
```

Para desplegar la función `swapiGet` localmente, utiliza el siguiente comando:

```bash
npx serverless invoke local -f swapiGet
```

### Despliegue en la Nube 🚀

Para desplegar tus funciones en la nube, asegúrate de configurar tus credenciales de AWS adecuadamente. Luego, utiliza el siguiente comando para realizar el despliegue:

```bash
npx serverless deploy
```

Estas instrucciones te permitirán ejecutar pruebas unitarias, desplegar tus funciones localmente y en la nube. Asegúrate de que tu entorno esté configurado correctamente antes de ejecutar estos comandos.