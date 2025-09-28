import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function Bignavbar() {
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessiblePages=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "http://localhost:3000";
  };
  
  return (
    <nav className="navbar">
      <a href="http://localhost:3001" className="navbar-logo">Home</a>
      <ul className="navbar-links">
        <li><Link to="/CoresspondantExtern">Correspondants Externes</Link></li>
        <li><Link to="/Coresspondantinterne">Correspondants Internes</Link></li>
        <li><Link to="/cheques">Chèques</Link></li>
        <li><Link to="/courrier/arrive">Courrier Arrivé</Link></li>
        <li><Link to="/courrier/depart">Courrier Départ</Link></li>
        <li><Link to="/courrier/search">Recherche Courrier</Link></li>
        <li><Link to="/users">Utilisateurs</Link></li>
        <li><Link to="/admin/groups">Groupes</Link></li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
}

export default Bignavbar;