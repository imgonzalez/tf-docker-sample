# Integración de React con Terraform y Nginx

Este documento detalla los pasos necesarios para integrar una aplicación React dentro de un proyecto de Terraform utilizando Nginx como servidor web.

## Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Componentes Clave](#componentes-clave)
3. [Pasos de Integración](#pasos-de-integración)
4. [Configuración de Terraform](#configuración-de-terraform)
5. [Configuración de Nginx](#configuración-de-nginx)
6. [Dockerfile Multi-etapa](#dockerfile-multi-etapa)
7. [Despliegue del Proyecto](#despliegue-del-proyecto)
8. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
9. [Mejores Prácticas](#mejores-prácticas)

## Estructura del Proyecto

Para integrar correctamente una aplicación React con Terraform y Nginx, es necesario organizar el proyecto con la siguiente estructura:

```
react-base/
├── public/                  # Archivos estáticos de React
│   ├── index.html           # Plantilla HTML principal
│   └── manifest.json        # Manifiesto para PWA
├── src/                     # Código fuente de React
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   └── ...                  # Otros componentes y archivos
├── Dockerfile               # Instrucciones para construir la imagen Docker
├── nginx.conf               # Configuración de Nginx
├── package.json             # Dependencias y scripts de npm
├── main.tf                  # Configuración de Terraform
└── README_TF.md             # Este documento
```

## Componentes Clave

### 1. Aplicación React

Una aplicación React estándar creada con Create React App o una configuración personalizada.

### 2. Nginx

Servidor web que sirve los archivos estáticos generados por la compilación de React.

### 3. Docker

Plataforma de contenedorización que empaqueta la aplicación y sus dependencias.

### 4. Terraform

Herramienta de infraestructura como código (IaC) que automatiza la creación y gestión de los recursos.

## Pasos de Integración

### 1. Preparar la Aplicación React

Si estás partiendo de cero:

```bash
# Crear una nueva aplicación React
npx create-react-app my-app
cd my-app

# O clonar un proyecto existente
git clone <url-repositorio>
cd <nombre-repositorio>
npm install
```

### 2. Crear el Archivo de Configuración de Nginx

Crear un archivo `nginx.conf` en la raíz del proyecto:

```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # redirect server error pages to the static page /50x.html
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

Esta configuración:
- Escucha en el puerto 80
- Sirve archivos desde `/usr/share/nginx/html`
- Redirige todas las rutas a `index.html` para soportar enrutamiento del lado del cliente
- Configura páginas de error

### 3. Crear el Dockerfile Multi-etapa

Crear un archivo `Dockerfile` en la raíz del proyecto:

```dockerfile
# Etapa de construcción
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Este Dockerfile:
1. Utiliza Node.js para instalar dependencias y construir la aplicación
2. Copia los archivos generados a una imagen ligera de Nginx
3. Configura Nginx con el archivo de configuración personalizado

### 4. Crear la Configuración de Terraform

Crear un archivo `main.tf` en la raíz del proyecto:

```hcl
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {}

# Construir la imagen de Docker para la aplicación React
resource "docker_image" "react_app" {
  name = "react-app:latest"
  build {
    context = "."
    dockerfile = "Dockerfile"
  }
}

# Crear el contenedor a partir de la imagen
resource "docker_container" "react_app" {
  name  = "react-app-container"
  image = docker_image.react_app.image_id

  ports {
    internal = 80
    external = 3000
  }
}
```

Esta configuración:
- Define el proveedor Docker para Terraform
- Crea un recurso para construir la imagen Docker
- Crea un recurso para ejecutar un contenedor basado en esa imagen
- Mapea el puerto 80 del contenedor al puerto 3000 del host

## Configuración de Terraform

### Inicialización

```bash
cd react-base
terraform init
```

Este comando inicializa el directorio de trabajo de Terraform, descargando los proveedores necesarios.

### Planificación

```bash
terraform plan
```

Este comando muestra los cambios que Terraform realizará en la infraestructura.

### Aplicación

```bash
terraform apply -auto-approve
```

Este comando aplica los cambios necesarios para alcanzar el estado deseado de la configuración.

### Destrucción

```bash
terraform destroy -auto-approve
```

Este comando destruye toda la infraestructura creada por Terraform.

## Configuración de Nginx

La configuración de Nginx (`nginx.conf`) está optimizada para aplicaciones de una sola página (SPA) como React:

- **try_files $uri $uri/ /index.html**: Esta directiva es crucial para el enrutamiento del lado del cliente. Cuando un usuario navega directamente a una ruta como `/about`, Nginx intentará servir ese archivo, y si no existe, servirá `index.html`, permitiendo que React maneje la ruta.

- **Compresión**: Para mejorar el rendimiento, puedes añadir compresión gzip:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

- **Caché**: Para archivos estáticos, puedes añadir encabezados de caché:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000";
}
```

## Dockerfile Multi-etapa

El Dockerfile utiliza un enfoque multi-etapa para optimizar el tamaño de la imagen final:

### Etapa 1: Construcción

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
```

Esta etapa:
1. Utiliza una imagen base de Node.js
2. Copia e instala las dependencias
3. Copia el código fuente
4. Construye la aplicación (generando archivos estáticos)

### Etapa 2: Producción

```dockerfile
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Esta etapa:
1. Utiliza una imagen base ligera de Nginx
2. Copia solo los archivos construidos de la etapa anterior
3. Configura Nginx
4. Expone el puerto 80
5. Inicia Nginx en primer plano

## Despliegue del Proyecto

### 1. Preparación

Asegúrate de tener instalados:
- Docker
- Terraform
- Node.js y npm (para desarrollo local)

### 2. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### 3. Despliegue con Terraform

```bash
# Inicializar Terraform
terraform init

# Ver plan de ejecución
terraform plan

# Aplicar configuración
terraform apply -auto-approve
```

### 4. Verificación

```bash
# Verificar que el contenedor está en ejecución
docker ps | grep react-app

# Verificar que la aplicación responde
curl -I http://localhost:3000
```

### 5. Acceso a la Aplicación

Abre un navegador y visita:
- http://localhost:3000

## Solución de Problemas Comunes

### 1. Error al construir la imagen Docker

**Problema**: Terraform falla al construir la imagen Docker.

**Solución**:
- Verifica que Docker esté en ejecución
- Construye la imagen manualmente para ver errores detallados:
  ```bash
  docker build -t react-app .
  ```

### 2. Problemas de permisos con Docker

**Problema**: Terraform no puede acceder al daemon de Docker.

**Solución**:
- Añade tu usuario al grupo docker:
  ```bash
  sudo usermod -aG docker $USER
  ```
- Reinicia tu sesión o ejecuta:
  ```bash
  newgrp docker
  ```

### 3. Problemas de enrutamiento en la aplicación React

**Problema**: Las rutas no funcionan al actualizar la página.

**Solución**:
- Verifica que la configuración de Nginx incluya `try_files $uri $uri/ /index.html;`
- Asegúrate de que estás usando un router compatible (como React Router)

### 4. Problemas de certificados al descargar proveedores

**Problema**: Terraform no puede descargar el proveedor Docker debido a problemas de certificados.

**Solución**:
- Configura la variable de entorno `TF_SKIP_PROVIDER_VERIFY=1`
- O descarga manualmente el proveedor y usa la opción `-plugin-dir`

## Mejores Prácticas

### 1. Seguridad

- Utiliza imágenes base oficiales y mantenlas actualizadas
- Escanea las imágenes en busca de vulnerabilidades
- No incluyas secretos en la imagen (usa variables de entorno o montajes)

### 2. Optimización

- Minimiza el tamaño de la imagen usando multi-etapa
- Implementa caché efectivo en Nginx
- Optimiza los assets de React durante la construcción

### 3. CI/CD

- Automatiza el proceso de construcción y despliegue
- Implementa pruebas automatizadas
- Utiliza variables de entorno para configurar diferentes entornos

### 4. Monitorización

- Configura health checks para el contenedor
- Implementa logging centralizado
- Configura alertas para problemas críticos

### 5. Escalabilidad

- Considera usar un orquestador como Kubernetes para múltiples instancias
- Implementa balanceo de carga si es necesario
- Utiliza CDN para contenido estático

## Conclusión

La integración de React con Terraform y Nginx proporciona una solución robusta y automatizada para el despliegue de aplicaciones web modernas. Este enfoque combina:

- **React**: Para crear interfaces de usuario interactivas
- **Nginx**: Para servir eficientemente contenido estático y manejar el enrutamiento
- **Docker**: Para empaquetar la aplicación y sus dependencias
- **Terraform**: Para automatizar y gestionar la infraestructura

Siguiendo los pasos y mejores prácticas descritos en este documento, podrás implementar un flujo de trabajo eficiente para el desarrollo y despliegue de aplicaciones React.
