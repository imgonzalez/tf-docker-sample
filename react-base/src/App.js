import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ReadmePage from './pages/ReadmePage';
import TerraformPage from './pages/TerraformPage';
import MenuPage from './pages/MenuPage';
import DeployPage from './pages/DeployPage';
import ColorPage from './pages/ColorPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <div id="page-wrap">
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/readme" element={<ReadmePage />} />
              <Route path="/terraform" element={<TerraformPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/deploy" element={<DeployPage />} />
              <Route path="/color" element={<ColorPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
