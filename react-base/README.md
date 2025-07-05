# Aplicación React con Nginx

Este es un proyecto de ejemplo de React que se puede desplegar con Docker y Nginx.

## Desarrollo local

Para ejecutar este proyecto en modo desarrollo:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Construcción para producción

Para construir la aplicación para producción:

```bash
npm run build
```

Esto generará una carpeta `build` con los archivos estáticos optimizados.

## Despliegue con Docker

Este proyecto incluye un Dockerfile para crear una imagen que ejecuta la aplicación React con Nginx.

### Construir la imagen

```bash
docker build -t react-app .
```

### Ejecutar el contenedor

```bash
docker run -p 8080:80 react-app
```

La aplicación estará disponible en [http://localhost:8080](http://localhost:8080).

## Configuración de Nginx

El archivo `nginx.conf` incluye la configuración básica para servir una aplicación React:

- Redirección de todas las rutas a index.html para soportar enrutamiento del lado del cliente
- Configuración para servir archivos estáticos eficientemente
- Manejo de páginas de error

## Integración con Terraform

Este proyecto está diseñado para ser desplegado utilizando Terraform con el proveedor de Docker, como se muestra en el proyecto principal.
