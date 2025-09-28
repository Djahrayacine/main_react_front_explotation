// src/Navbarr.js
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function Navbarr({ basePath = "" }) {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to={`${basePath}/create`}>Créer</Link></li>
        <li><Link to={`${basePath}/list`}>Lister</Link></li>
        <li><Link to={`${basePath}/edit`}>Édition</Link></li>
      </ul>
    </nav>
  );
}

export default Navbarr;
