import React from 'react';
import './MarkdownPage.css';

const TerraformPage = () => {
  return (
    <div className="markdown-container">
      <h1>Integración de React con Terraform y Nginx</h1>
      
      <p>Este documento detalla los pasos necesarios para integrar una aplicación React dentro de un proyecto de Terraform utilizando Nginx como servidor web.</p>
      
      <h2>Estructura del Proyecto</h2>
      
      <p>Para integrar correctamente una aplicación React con Terraform y Nginx, es necesario organizar el proyecto con la siguiente estructura:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`react-base/
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
└── README_TF.md             # Este documento`}
          </code>
        </pre>
      </div>
      
      <h2>Componentes Clave</h2>
      
      <h3>1. Aplicación React</h3>
      <p>Una aplicación React estándar creada con Create React App o una configuración personalizada.</p>
      
      <h3>2. Nginx</h3>
      <p>Servidor web que sirve los archivos estáticos generados por la compilación de React.</p>
      
      <h3>3. Docker</h3>
      <p>Plataforma de contenedorización que empaqueta la aplicación y sus dependencias.</p>
      
      <h3>4. Terraform</h3>
      <p>Herramienta de infraestructura como código (IaC) que automatiza la creación y gestión de los recursos.</p>
      
      <h2>Pasos de Integración</h2>
      
      <h3>1. Preparar la Aplicación React</h3>
      <div className="code-block">
        <pre>
          <code>
{`# Crear una nueva aplicación React
npx create-react-app my-app
cd my-app

# O clonar un proyecto existente
git clone <url-repositorio>
cd <nombre-repositorio>
npm install`}
          </code>
        </pre>
      </div>
      
      <h3>2. Crear el Archivo de Configuración de Nginx</h3>
      <p>Crear un archivo <code>nginx.conf</code> en la raíz del proyecto:</p>
      <div className="code-block">
        <pre>
          <code>
{`server {
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
}`}
          </code>
        </pre>
      </div>
      
      <h3>3. Crear el Dockerfile Multi-etapa</h3>
      <div className="code-block">
        <pre>
          <code>
{`# Etapa de construcción
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
CMD ["nginx", "-g", "daemon off;"]`}
          </code>
        </pre>
      </div>
      
      <h3>4. Crear la Configuración de Terraform</h3>
      <div className="code-block">
        <pre>
          <code>
{`terraform {
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
}`}
          </code>
        </pre>
      </div>
      
      <h2>Despliegue del Proyecto</h2>
      
      <h3>1. Inicialización de Terraform</h3>
      <div className="code-block">
        <pre>
          <code>
{`cd react-base
terraform init`}
          </code>
        </pre>
      </div>
      
      <h3>2. Aplicación de la Configuración</h3>
      <div className="code-block">
        <pre>
          <code>terraform apply -auto-approve</code>
        </pre>
      </div>
      
      <h3>3. Verificación del Despliegue</h3>
      <div className="code-block">
        <pre>
          <code>
{`# Verificar que el contenedor está en ejecución
docker ps | grep react-app

# Verificar que la aplicación responde
curl -I http://localhost:3000`}
          </code>
        </pre>
      </div>
      
      <h2>Conclusión</h2>
      
      <p>La integración de React con Terraform y Nginx proporciona una solución robusta y automatizada para el despliegue de aplicaciones web modernas. Este enfoque combina:</p>
      
      <ul>
        <li><strong>React</strong>: Para crear interfaces de usuario interactivas</li>
        <li><strong>Nginx</strong>: Para servir eficientemente contenido estático y manejar el enrutamiento</li>
        <li><strong>Docker</strong>: Para empaquetar la aplicación y sus dependencias</li>
        <li><strong>Terraform</strong>: Para automatizar y gestionar la infraestructura</li>
      </ul>
    </div>
  );
};

export default TerraformPage;
