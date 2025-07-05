import React from 'react';
import './MarkdownPage.css';

const DeployPage = () => {
  return (
    <div className="markdown-container">
      <h1>Despliegue de Cambios en Aplicaciones React con Docker y Terraform</h1>
      
      <p>Este documento detalla el proceso para desplegar cambios en archivos JavaScript de una aplicación React utilizando Docker y Terraform. El enfoque permite una integración continua eficiente y un despliegue automatizado de modificaciones en la interfaz de usuario.</p>
      
      <h2>Flujo de Trabajo General</h2>
      
      <p>El proceso de despliegue de cambios en archivos JavaScript sigue este flujo de trabajo:</p>
      
      <ol>
        <li><strong>Desarrollo local</strong> - Modificación de archivos JavaScript en el entorno de desarrollo</li>
        <li><strong>Identificación de cambios</strong> - Determinación de qué archivos se han modificado</li>
        <li><strong>Reconstrucción</strong> - Reconstrucción de la imagen Docker con los cambios</li>
        <li><strong>Despliegue</strong> - Aplicación de la configuración de Terraform para desplegar los cambios</li>
        <li><strong>Verificación</strong> - Comprobación de que los cambios se han aplicado correctamente</li>
      </ol>
      
      <p>Este enfoque garantiza que los cambios se desplieguen de manera consistente y reproducible en cualquier entorno.</p>
      
      <h2>Identificación de Archivos Modificados</h2>
      
      <p>Para identificar qué archivos JavaScript se han modificado, podemos utilizar el siguiente comando:</p>
      
      <div className="code-block">
        <pre>
          <code>find src -name "*.js" -type f | xargs git diff --name-only</code>
        </pre>
      </div>
      
      <p>Este comando muestra todos los archivos JavaScript en el directorio <code>src</code> que han sido modificados desde el último commit.</p>
      
      <p>Alternativamente, para listar todos los archivos JavaScript en el proyecto:</p>
      
      <div className="code-block">
        <pre>
          <code>find src -name "*.js" | sort</code>
        </pre>
      </div>
      
      <h2>Proceso de Reconstrucción</h2>
      
      <h3>1. Destrucción de Recursos Existentes</h3>
      
      <p>Antes de reconstruir la aplicación, es necesario destruir los recursos existentes:</p>
      
      <div className="code-block">
        <pre>
          <code>cd react-base
terraform destroy -auto-approve</code>
        </pre>
      </div>
      
      <p>Este comando elimina:</p>
      <ul>
        <li>El contenedor Docker que ejecuta la aplicación</li>
        <li>La imagen Docker de la aplicación</li>
      </ul>
      
      <h3>2. Reconstrucción de la Imagen Docker</h3>
      
      <p>La reconstrucción de la imagen Docker se realiza automáticamente durante el proceso de aplicación de Terraform:</p>
      
      <div className="code-block">
        <pre>
          <code>terraform apply -auto-approve</code>
        </pre>
      </div>
      
      <p>Durante este proceso:</p>
      
      <ol>
        <li>Terraform ejecuta el comando <code>docker build</code> utilizando el Dockerfile del proyecto</li>
        <li>El Dockerfile ejecuta los siguientes pasos:
          <ul>
            <li>Utiliza Node.js para instalar dependencias (<code>npm install</code>)</li>
            <li>Copia los archivos fuente modificados</li>
            <li>Compila la aplicación React (<code>npm run build</code>)</li>
            <li>Copia los archivos compilados a una imagen de Nginx</li>
          </ul>
        </li>
      </ol>
      
      <h2>Despliegue con Terraform</h2>
      
      <h3>1. Configuración de Terraform</h3>
      
      <p>El archivo <code>main.tf</code> contiene la configuración necesaria para desplegar la aplicación:</p>
      
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
      
      <h3>2. Aplicación de la Configuración</h3>
      
      <p>Para aplicar la configuración y desplegar los cambios:</p>
      
      <div className="code-block">
        <pre>
          <code>terraform apply -auto-approve</code>
        </pre>
      </div>
      
      <p>Este comando:</p>
      <ol>
        <li>Construye una nueva imagen Docker con los cambios en los archivos JavaScript</li>
        <li>Crea un nuevo contenedor a partir de esa imagen</li>
        <li>Configura el mapeo de puertos (puerto 80 del contenedor al puerto 3000 del host)</li>
      </ol>
      
      <h2>Verificación del Despliegue</h2>
      
      <h3>1. Verificación del Estado del Contenedor</h3>
      
      <p>Para verificar que el contenedor está en ejecución:</p>
      
      <div className="code-block">
        <pre>
          <code>docker ps | grep react-app</code>
        </pre>
      </div>
      
      <p>La salida debe mostrar el contenedor <code>react-app-container</code> en estado "Up".</p>
      
      <h3>2. Verificación de la Respuesta de la Aplicación</h3>
      
      <p>Para verificar que la aplicación está respondiendo:</p>
      
      <div className="code-block">
        <pre>
          <code>curl -s -I http://localhost:3000</code>
        </pre>
      </div>
      
      <p>La respuesta debe incluir un código de estado HTTP 200 OK.</p>
      
      <h2>Mejores Prácticas</h2>
      
      <ol>
        <li>
          <strong>Control de Versiones</strong>:
          <ul>
            <li>Mantén todos los archivos de configuración en un sistema de control de versiones</li>
            <li>Etiqueta las versiones estables de la aplicación</li>
          </ul>
        </li>
        <li>
          <strong>Automatización</strong>:
          <ul>
            <li>Automatiza el proceso de despliegue con scripts o pipelines de CI/CD</li>
            <li>Implementa pruebas automatizadas antes del despliegue</li>
          </ul>
        </li>
        <li>
          <strong>Monitorización</strong>:
          <ul>
            <li>Configura monitorización para la aplicación desplegada</li>
            <li>Implementa alertas para problemas críticos</li>
          </ul>
        </li>
      </ol>
      
      <h2>Conclusión</h2>
      
      <p>El despliegue de cambios en archivos JavaScript de una aplicación React utilizando Docker y Terraform proporciona un enfoque robusto y reproducible. Este proceso garantiza que los cambios se apliquen de manera consistente en diferentes entornos y facilita la integración continua y el despliegue continuo (CI/CD).</p>
      
      <p>Al seguir este flujo de trabajo, los desarrolladores pueden centrarse en la implementación de nuevas características y mejoras, mientras que el proceso de despliegue se mantiene eficiente y confiable.</p>
    </div>
  );
};

export default DeployPage;
