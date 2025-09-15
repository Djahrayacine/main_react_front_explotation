    // src/Navbarr.js

    import React from "react";
    import "./NavBar.css";
    import { Link } from 'react-router-dom';
  function Bignavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">Dashboard</div>
        <ul className="navbar-links">
          <li><Link to="/CoresspondantExtern">correspondantsexterne</Link></li>
          <li><Link to="/Coresspondantinterne">correspondantsintene</Link></li>
          <li><Link to="/cheques">cheques</Link></li>
          <li><Link to="/courrier/arrive">Arrive</Link></li>
          <li><Link to="/courrier/depart">Depart</Link></li>
          <li><Link to="/courrier/search">🔍 Recherche Courrier</Link></li>
          <li><Link to="/admin/groups">⚙️ Groups Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
}

    export default Bignavbar;
