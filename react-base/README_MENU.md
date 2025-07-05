# Integración de Menú Hamburguesa en React

Este documento detalla el proceso de integración de un menú tipo hamburguesa (sidebar) en una aplicación React, utilizando la biblioteca `react-burger-menu` y `react-router-dom` para la navegación entre páginas.

## Índice

1. [Dependencias Necesarias](#dependencias-necesarias)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Componente Sidebar](#componente-sidebar)
4. [Configuración de Rutas](#configuración-de-rutas)
5. [Estilos del Menú](#estilos-del-menú)
6. [Integración con Páginas de Contenido](#integración-con-páginas-de-contenido)
7. [Personalización del Menú](#personalización-del-menú)
8. [Mejores Prácticas](#mejores-prácticas)

## Dependencias Necesarias

Para implementar un menú hamburguesa en React, necesitamos instalar las siguientes dependencias:

```bash
npm install react-burger-menu react-router-dom
```

Estas bibliotecas deben añadirse al archivo `package.json`:

```json
"dependencies": {
  "react": "^18.2.0",
  "react-burger-menu": "^3.0.9",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "react-scripts": "5.0.1"
}
```

## Estructura de Archivos

Para una organización óptima del proyecto, se recomienda la siguiente estructura de archivos:

```
src/
├── components/
│   ├── Sidebar.js       # Componente del menú hamburguesa
│   └── Sidebar.css      # Estilos para el menú
├── pages/
│   ├── HomePage.js      # Página de inicio
│   ├── OtherPage1.js    # Otras páginas de contenido
│   ├── OtherPage2.js    # Otras páginas de contenido
│   └── ...
├── App.js               # Componente principal con enrutamiento
└── App.css              # Estilos para el componente App
```

## Componente Sidebar

El componente `Sidebar.js` es el núcleo del menú hamburguesa. A continuación se muestra un ejemplo de implementación:

```jsx
import React from 'react';
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
      {/* Añadir más enlaces según sea necesario */}
    </Menu>
  );
};

export default Sidebar;
```

### Características del Componente

- **Importaciones Clave**:
  - `slide as Menu`: Importa el estilo de animación "slide" de react-burger-menu
  - `Link`: Componente de react-router-dom para la navegación sin recargar la página

- **Estructura**:
  - El componente `Menu` envuelve todos los elementos del menú
  - Cada `Link` representa un elemento del menú que navega a una ruta específica

## Configuración de Rutas

En el archivo `App.js`, configuramos las rutas para cada página:

```jsx
import React from 'react';
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

export default App;
```

### Elementos Clave

- **Router**: Envuelve toda la aplicación para habilitar el enrutamiento
- **Sidebar**: Se coloca fuera del contenido principal pero dentro del Router
- **Routes y Route**: Definen las rutas disponibles y los componentes a renderizar
- **IDs importantes**:
  - `outer-container`: Contiene toda la aplicación
  - `page-wrap`: Contiene el contenido principal que se desplaza cuando el menú está abierto

## Estilos del Menú

El archivo `Sidebar.css` contiene los estilos necesarios para personalizar el menú:

```css
/* Position and sizing of burger button */
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
}
```

### Clases CSS Importantes

- **bm-burger-button**: Estilo del botón hamburguesa
- **bm-menu**: Estilo del panel del menú
- **bm-item**: Estilo de cada elemento del menú
- **bm-overlay**: Estilo del overlay que aparece cuando el menú está abierto

## Integración con Páginas de Contenido

Para cada página de contenido, creamos un componente React que renderiza el contenido específico. Por ejemplo:

```jsx
import React from 'react';
import './PageStyles.css';

const Page1 = () => {
  return (
    <div className="page-container">
      <h1>Título de la Página</h1>
      <p>Contenido de la página...</p>
      {/* Más contenido aquí */}
    </div>
  );
};

export default Page1;
```

### Consideraciones para las Páginas

- Cada página debe ser un componente independiente
- Las páginas pueden compartir estilos comunes
- Para contenido basado en archivos Markdown, se puede utilizar una biblioteca como `react-markdown`

## Personalización del Menú

React Burger Menu ofrece varias opciones de personalización:

### Diferentes Animaciones

```jsx
// Importar diferentes estilos de animación
import { slide, stack, elastic, bubble } from 'react-burger-menu';

// Usar el estilo deseado
<stack>
  {/* Elementos del menú */}
</stack>
```

### Propiedades Configurables

```jsx
<Menu
  isOpen={menuOpen}
  onStateChange={(state) => setMenuOpen(state.isOpen)}
  width={'280px'}
  disableAutoFocus
  noOverlay
>
  {/* Elementos del menú */}
</Menu>
```

### Eventos del Menú

```jsx
const closeMenu = () => {
  setMenuOpen(false);
};

<Link className="menu-item" to="/" onClick={closeMenu}>
  Inicio
</Link>
```

## Mejores Prácticas

1. **Accesibilidad**:
   - Asegúrate de que el menú sea navegable con teclado
   - Incluye atributos ARIA apropiados
   - Prueba con lectores de pantalla

2. **Rendimiento**:
   - Evita renderizados innecesarios usando React.memo o componentes puros
   - Optimiza las transiciones CSS para dispositivos de bajo rendimiento

3. **Diseño Responsivo**:
   - Ajusta el tamaño y posición del menú según el tamaño de pantalla
   - Considera diferentes comportamientos para móvil y escritorio

4. **Estado del Menú**:
   - Gestiona el estado del menú (abierto/cerrado) con hooks de React
   - Cierra el menú automáticamente después de seleccionar una opción en dispositivos móviles

5. **Navegación**:
   - Asegúrate de que la URL se actualice correctamente al navegar
   - Implementa indicadores visuales para la página actual

## Conclusión

La integración de un menú hamburguesa en una aplicación React mejora significativamente la experiencia de usuario, especialmente en dispositivos móviles. Utilizando `react-burger-menu` junto con `react-router-dom`, podemos crear una navegación fluida y atractiva con relativamente poco código.

Este enfoque proporciona una base sólida que puede personalizarse según las necesidades específicas del proyecto, ya sea ajustando los estilos, las animaciones o el comportamiento del menú.
