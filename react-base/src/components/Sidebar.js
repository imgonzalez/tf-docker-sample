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
      <Link className="menu-item" to="/readme">
        Project Base
      </Link>
      <Link className="menu-item" to="/terraform">
        Terraform Integration
      </Link>
      <Link className="menu-item" to="/menu">
        Menu Documentation
      </Link>
      <Link className="menu-item" to="/deploy">
        Deploy Changes
      </Link>
    </Menu>
  );
};

export default Sidebar;
