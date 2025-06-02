# README.txt

Hola, esta es la prueba tecnica hecho con React!

Te cuento cómo podés arrancarlo y un resumen de cómo está organizado:

## Instrucciones para iniciar el proyecto:

1. Abrír la terminal y ubicarse en la carpeta donde está el proyecto (la carpeta se llama "mi-app").

    En caso de no estar ubicado en la carpeta "mi-app", se puede ejecutar el siguiente comando ```cd mi-app```

2. Instalar las dependencias con el comando:

```npm install```

3. Por ultimo, para correr el proyecto y verlo funcionando:

```npm run dev```

--------------------------------------------------

## Estructura del proyecto y cómo funciona:

- **services/**  
En esta carpeta hice una API falsa (`fakeApi.js`) que simula las llamadas reales que haría una API externa. Por ejemplo, simula el inicio de sesión, la obtención de usuarios, estudios, direcciones, etc.

- **context/**  
Aquí está el `AuthContext`, que es el encargado de manejar todo lo relacionado a la sesión del usuario como el token, datos del usuario logueado y sus roles. Tambien gracias a esto pude proteger las rutas, logrando manejar qué ve cada usuario (admin o usuario normal) y mantener la sesión activa en toda la app.

- **components/**  
Acá están todos los componentes que reutilizo en diferentes partes del proyecto. Por ejemplo, formularios, los tabs, la gestión de estudios y direcciones, y otros componentes visuales.

- **pages/**  
En esta carpeta están todas las páginas de la aplicación que uso para navegar con `react-router-dom`. Incluye la página de login y el dashboard, que cambia según el rol del usuario.

- **styles/**  
En `styles` guardé los archivos CSS de manera individual para mejor organizacion. 

---------

## Cualquier Duda pueden consultarme:

tomasf.m@icloud.com