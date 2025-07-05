import React from 'react';
import './MarkdownPage.css';

const MenuPage = () => {
  return (
    <div className="markdown-container">
      <h1>Integración de Menú Hamburguesa en React</h1>
      
      <p>Este documento detalla el proceso de integración de un menú tipo hamburguesa (sidebar) en una aplicación React, utilizando la biblioteca <code>react-burger-menu</code> y <code>react-router-dom</code> para la navegación entre páginas.</p>
      
      <h2 id="dependencias-necesarias">Dependencias Necesarias</h2>
      
      <p>Para implementar un menú hamburguesa en React, necesitamos instalar las siguientes dependencias:</p>
      
      <div className="code-block">
        <pre>
          <code>npm install react-burger-menu react-router-dom</code>
        </pre>
      </div>
      
      <p>Estas bibliotecas deben añadirse al archivo <code>package.json</code>:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`"dependencies": {
  "react": "^18.2.0",
  "react-burger-menu": "^3.0.9",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "react-scripts": "5.0.1"
}`}
          </code>
        </pre>
      </div>
      
      <h2 id="estructura-de-archivos">Estructura de Archivos</h2>
      
      <p>Para una organización óptima del proyecto, se recomienda la siguiente estructura de archivos:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`src/
├── components/
│   ├── Sidebar.js       # Componente del menú hamburguesa
│   └── Sidebar.css      # Estilos para el menú
├── pages/
│   ├── HomePage.js      # Página de inicio
│   ├── OtherPage1.js    # Otras páginas de contenido
│   ├── OtherPage2.js    # Otras páginas de contenido
│   └── ...
├── App.js               # Componente principal con enrutamiento
└── App.css              # Estilos para el componente App`}
          </code>
        </pre>
      </div>
      
      <h2 id="componente-sidebar">Componente Sidebar</h2>
      
      <p>El componente <code>Sidebar.js</code> es el núcleo del menú hamburguesa. A continuación se muestra un ejemplo de implementación:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <Menu>
      <Link className="menu-item" to="/">
        Inicio
      </Link>
      <Link className="menu-item" to="/page1">
        Página 1
      </Link>
      <Link className="menu-item" to="/page2">
        Página 2
      </Link>
      <Link className="menu-item" to="/color">
        Random Color
      </Link>
      {/* Añadir más enlaces según sea necesario */}
    </Menu>
  );
};

export default Sidebar;`}
          </code>
        </pre>
      </div>
      
      <h3>Características del Componente</h3>
      
      <ul>
        <li>
          <strong>Importaciones Clave</strong>:
          <ul>
            <li><code>slide as Menu</code>: Importa el estilo de animación "slide" de react-burger-menu</li>
            <li><code>Link</code>: Componente de react-router-dom para la navegación sin recargar la página</li>
          </ul>
        </li>
        <li>
          <strong>Estructura</strong>:
          <ul>
            <li>El componente <code>Menu</code> envuelve todos los elementos del menú</li>
            <li>Cada <code>Link</code> representa un elemento del menú que navega a una ruta específica</li>
          </ul>
        </li>
      </ul>
      
      <h2 id="configuración-de-rutas">Configuración de Rutas</h2>
      
      <p>En el archivo <code>App.js</code>, configuramos las rutas para cada página:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" id="outer-container">
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <div id="page-wrap">
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
              {/* Añadir más rutas según sea necesario */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;`}
          </code>
        </pre>
      </div>
      
      <h3>Elementos Clave</h3>
      
      <ul>
        <li><strong>Router</strong>: Envuelve toda la aplicación para habilitar el enrutamiento</li>
        <li><strong>Sidebar</strong>: Se coloca fuera del contenido principal pero dentro del Router</li>
        <li><strong>Routes y Route</strong>: Definen las rutas disponibles y los componentes a renderizar</li>
        <li>
          <strong>IDs importantes</strong>:
          <ul>
            <li><code>outer-container</code>: Contiene toda la aplicación</li>
            <li><code>page-wrap</code>: Contiene el contenido principal que se desplaza cuando el menú está abierto</li>
          </ul>
        </li>
      </ul>
      
      <h2 id="estilos-del-menú">Estilos del Menú</h2>
      
      <p>El archivo <code>Sidebar.css</code> contiene los estilos necesarios para personalizar el menú:</p>
      
      <div className="code-block">
        <pre>
          <code>
{`/* Position and sizing of burger button */
.bm-burger-button {
  position: fixed;
  width: 36px;
  height: 30px;
  left: 36px;
  top: 36px;
}

/* Color/shape of burger icon bars */
.bm-burger-bars {
  background: #373a47;
}

/* Color/shape of burger icon bars on hover*/
.bm-burger-bars-hover {
  background: #a90000;
}

/* Position and sizing of clickable cross button */
.bm-cross-button {
  height: 24px;
  width: 24px;
}

/* Color/shape of close button cross */
.bm-cross {
  background: #bdc3c7;
}

/* General sidebar styles */
.bm-menu {
  background: #373a47;
  padding: 2.5em 1.5em 0;
  font-size: 1.15em;
}

/* Morph shape necessary with bubble or elastic */
.bm-morph-shape {
  fill: #373a47;
}

/* Wrapper for item list */
.bm-item-list {
  color: #b8b7ad;
  padding: 0.8em;
}

/* Individual item */
.bm-item {
  display: inline-block;
  color: #d1d1d1;
  margin-bottom: 10px;
  text-align: left;
  text-decoration: none;
  transition: color 0.2s;
}

.bm-item:hover {
  color: #ffffff;
}

/* Styling of overlay */
.bm-overlay {
  background: rgba(0, 0, 0, 0.3);
}

.menu-item {
  display: block;
  padding: 10px 0;
}`}
          </code>
        </pre>
      </div>
      
      <h3>Clases CSS Importantes</h3>
      
      <ul>
        <li><strong>bm-burger-button</strong>: Estilo del botón hamburguesa</li>
        <li><strong>bm-menu</strong>: Estilo del panel del menú</li>
        <li><strong>bm-item</strong>: Estilo de cada elemento del menú</li>
        <li><strong>bm-overlay</strong>: Estilo del overlay que aparece cuando el menú está abierto</li>
      </ul>
      
      <h2 id="mejores-prácticas">Mejores Prácticas</h2>
      
      <ol>
        <li>
          <strong>Accesibilidad</strong>:
          <ul>
            <li>Asegúrate de que el menú sea navegable con teclado</li>
            <li>Incluye atributos ARIA apropiados</li>
            <li>Prueba con lectores de pantalla</li>
          </ul>
        </li>
        <li>
          <strong>Rendimiento</strong>:
          <ul>
            <li>Evita renderizados innecesarios usando React.memo o componentes puros</li>
            <li>Optimiza las transiciones CSS para dispositivos de bajo rendimiento</li>
          </ul>
        </li>
        <li>
          <strong>Diseño Responsivo</strong>:
          <ul>
            <li>Ajusta el tamaño y posición del menú según el tamaño de pantalla</li>
            <li>Considera diferentes comportamientos para móvil y escritorio</li>
          </ul>
        </li>
      </ol>
      
      <h2>Conclusión</h2>
      
      <p>La integración de un menú hamburguesa en una aplicación React mejora significativamente la experiencia de usuario, especialmente en dispositivos móviles. Utilizando <code>react-burger-menu</code> junto con <code>react-router-dom</code>, podemos crear una navegación fluida y atractiva con relativamente poco código.</p>
      
      <p>Este enfoque proporciona una base sólida que puede personalizarse según las necesidades específicas del proyecto, ya sea ajustando los estilos, las animaciones o el comportamiento del menú.</p>
    </div>
  );
};

export default MenuPage;
