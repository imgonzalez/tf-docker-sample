import React from 'react';
import './MarkdownPage.css';

const ReadmePage = () => {
  return (
    <div className="markdown-container">
      <h1>Aplicación React con Nginx</h1>
      
      <p>Este es un proyecto de ejemplo de React que se puede desplegar con Docker y Nginx.</p>
      
      <h2>Desarrollo local</h2>
      
      <p>Para ejecutar este proyecto en modo desarrollo:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start`}
          </code>
        </pre>
      </div>
      
      <p>La aplicación estará disponible en <a href="http://localhost:3000">http://localhost:3000</a>.</p>
      
      <h2>Construcción para producción</h2>
      
      <p>Para construir la aplicación para producción:</p>
      
      <div className="code-block">
        <pre>
          <code>npm run build</code>
        </pre>
      </div>
      
      <p>Esto generará una carpeta <code>build</code> con los archivos estáticos optimizados.</p>
      
      <h2>Despliegue con Docker</h2>
      
      <p>Este proyecto incluye un Dockerfile para crear una imagen que ejecuta la aplicación React con Nginx.</p>
      
      <h3>Construir la imagen</h3>
      
      <div className="code-block">
        <pre>
          <code>docker build -t react-app .</code>
        </pre>
      </div>
      
      <h3>Ejecutar el contenedor</h3>
      
      <div className="code-block">
        <pre>
          <code>docker run -p 8080:80 react-app</code>
        </pre>
      </div>
      
      <p>La aplicación estará disponible en <a href="http://localhost:8080">http://localhost:8080</a>.</p>
      
      <h2>Configuración de Nginx</h2>
      
      <p>El archivo <code>nginx.conf</code> incluye la configuración básica para servir una aplicación React:</p>
      
      <ul>
        <li>Redirección de todas las rutas a index.html para soportar enrutamiento del lado del cliente</li>
        <li>Configuración para servir archivos estáticos eficientemente</li>
        <li>Manejo de páginas de error</li>
      </ul>
      
      <h2>Integración con Terraform</h2>
      
      <p>Este proyecto está diseñado para ser desplegado utilizando Terraform con el proveedor de Docker, como se muestra en el proyecto principal.</p>
    </div>
  );
};

export default ReadmePage;
