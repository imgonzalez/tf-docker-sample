import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Proyecto React con Docker y Terraform</h1>
      <p className="intro">
        Bienvenido a este proyecto de ejemplo que demuestra la integración de React con Docker y Terraform.
        Esta aplicación sirve como una guía práctica para implementar una arquitectura moderna de despliegue.
      </p>
      
      <div className="cards-container">
        <div className="card">
          <h2>Project Base</h2>
          <p>Información básica sobre el proyecto y cómo ejecutarlo localmente o con Docker.</p>
          <Link to="/readme" className="card-button">Ver más</Link>
        </div>

        <div className="card">
          <h2>Terraform Integration</h2>
          <p>Guía detallada sobre cómo integrar React con Terraform y Nginx para despliegues automatizados.</p>
          <Link to="/terraform" className="card-button">Ver más</Link>
        </div>

        <div className="card">
          <h2>Menu Documentation</h2>
          <p>Documentación sobre la implementación del menú hamburguesa en React con react-burger-menu.</p>
          <Link to="/menu" className="card-button">Ver más</Link>
        </div>

        <div className="card">
          <h2>Deploy Changes</h2>
          <p>Guía sobre cómo desplegar cambios en archivos JavaScript utilizando Docker y Terraform.</p>
          <Link to="/deploy" className="card-button">Ver más</Link>
        </div>

        <div className="card">
          <h2>Random Color</h2>
          <p>Obtén un color aleatorio en formato HEX desde la API FastAPI.</p>
          <Link to="/color" className="card-button">Ver más</Link>
        </div>
      </div>
      
      <div className="tech-stack">
        <h3>Tecnologías utilizadas:</h3>
        <ul>
          <li>React</li>
          <li>Docker</li>
          <li>Nginx</li>
          <li>Terraform</li>
          <li>React Router</li>
          <li>React Burger Menu</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
