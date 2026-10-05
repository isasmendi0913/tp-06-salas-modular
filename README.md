# Trabajo práctico 06

## Proyecto de partida y cambios

Este trabajo parte de una copia funcional del TP05 (`tp-05-salas-middleware`). La aplicación funcionaba con todo el código dentro de `src/index.js`. En este TP se reorganiza en módulos con responsabilidades claras, sin cambiar el comportamiento externo.

**Conservado del TP05:**
- Vistas EJS, layout y parciales.
- CSS en `public/css/estilos.css`.
- Datos iniciales en `datos/reservas.json`.
- Morgan, identificador de solicitud (`BIB-0001`), medición hasta `finish`.
- Validación del POST, alcances de middleware.
- Todos los códigos HTTP (200, 302, 400, 404).

**Refactorizado:**
- Middleware separado en `middleware/solicitudes.js` y `middleware/reservas.js`.
- Servicio en `servicios/reservas.js` dueño del arreglo.
- Controlador en `controladores/reservas.js`.
- Router en `rutas/reservas.js`.
- Configuración y arranque separados (`configuracion.js`, `app.js`, `index.js`).

**Incorporado:**
- Configuración por entorno (`PORT`, `NODE_ENV`).
- Formato y análisis estático con Prettier y ESLint.

## Instalación

    ---- ingrese por consola "npm install" ------
## Ejecucion 
    ---- ingrese en consola "npm start" -----  
    ---- crea un servidor local  http://localhost:3000. Detener con Ctrl + C. ----

## Configuración
 ---- npm init -y -----
----- npm install express ejs express-ejs-layouts -----

## Configuración del entorno
--- Variables leídas desde process.env:

Variable |	Uso	                                                  |Predeterminado
PORT	 |  Puerto del servidor (entero entre 1 y 65535)	      | 3000
NODE_ENV |	En production usa Morgan combined, en otro caso dev   |	development

--- Copiar .env.example a .env para configuración local: 

                cp .env.example .env
                npm run start:local

                Mapa de módulos y dependencias
Módulo	                       | Responsabilidad                                                    |	Depende de
src/index.js	               | Crea el servicio, lee configuración, crea la app y abre el puerto	|   configuracion,archivos, servicios, app
src/configuracion.js	       | Convierte y valida process.env                                     |
src/archivos.js	               | Lee el JSON inicial	                                            |
src/app.js	                   | Configura vistas, pipeline, monta routers y 404	                |   middleware, controladores, rutas
src/rutas/reservas.js	       | Relaciona método y camino con middleware y controlador             |	middleware, controlador
src/controladores/reservas.js  | Lee params, renderiza, responde JSON, 404 y redirige	            |   servicio
src/servicios/reservas.js	   | Listar, buscar, contar y crear reservas en memoria	                |
src/middleware/solicitudes.js  | Identificador y medición	                                        |
src/middleware/reservas.js	   | Sección y validación	                                            |

    Pipeline y contrato de rutas
                                                        text
                                                morgan(formatoRegistro)
                                                         ↓
                                                  identificarSolicitud
                                                         ↓
                                                    medirDuracion
                                                         ↓
                                                    expressLayouts
                                                         ↓
                                                    express.static
                                                         ↓
                                                express.urlencoded
                                                         ↓
                                                    express.json
                                                         ↓
                                                rutas de aplicación
                                                         ↓
                                                  router /reservas
                                                         ↓
                                                        404
Método	                  | Ruta	                    |   Descripción
GET                       |  	/                       |	Inicio
GET	                      |     /estado	                | JSON con servicio, cantidad y solicitudId
GET	                      |     /reservas	            | Listado
GET	                      |     /reservas/nueva	        | Formulario
GET	                      |     /reservas/:id	        | Detalle (200 o 404)
POST	                  |     /reservas	            | Validación + creación + redirect (302 o 400)
GET	                      |     /css/estilos.css	    | Recurso estático
—	                      |     otra URL                |	404 HTML

Script	                 Función
format	        Prettier reescribe el formato de src
format:check	Verifica el formato sin modificar
lint	        ESLint informa patrones problemáticos
check	        Ejecuta format:check y lint



## Persistencia temporal y límites

Las reservas viven en el arreglo en memoria del servicio. Al reiniciar, el proceso vuelve a ejecutar main(), lee datos/reservas.json y crea un arreglo nuevo. Las altas del POST desaparecen porque nunca se escriben en disco.

## Conceptos
Por qué el servicio no usa res: el servicio solo conoce datos. Convertir resultados en respuestas HTTP es tarea del controlador. Esto permite cambiar la implementación del servicio (por ejemplo, por una base de datos) sin tocar el controlador.

Qué hace el controlador: lee req.params, llama al servicio, decide el código HTTP, renderiza EJS, responde JSON o redirige.

Por qué el router declara caminos relativos: el montaje app.use("/reservas", router) agrega el prefijo. Si el router repitiera /reservas, las URLs quedarían duplicadas (/reservas/reservas).

Dónde vive el único arreglo de reservas: dentro del servicio, como variable privada de la fábrica crearServicioReservas(datosIniciales). Una sola instancia compartida por listado, detalle, /estado y creación.

Qué ocurre al reiniciar: el proceso vuelve a ejecutar main(), lee el JSON y crea un arreglo nuevo. Las altas en memoria desaparecen porque no se escriben en disco.