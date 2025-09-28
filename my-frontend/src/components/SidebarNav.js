import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarNav.css';

function SidebarNav() {
  const [openSection, setOpenSection] = useState(null);
  const [openSubsection, setOpenSubsection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
    setOpenSubsection(null);
  };

  const toggleSubsection = (sub) => {
    setOpenSubsection(openSubsection === sub ? null : sub);
  };

  return (
    <nav className="sidebar">
      <button className="nav-toggle" onClick={() => toggleSection('correspondant')}>
        📁 Correspondant
      </button>
      {openSection === 'correspondant' && (
        <ul className="nav-sub">
          <li>
            <button onClick={() => toggleSubsection('interne')}>Interne</button>
            {openSubsection === 'interne' && (
              <ul className="nav-sub-sub">
                <li><Link to="/Coresspondantinterne/create">Créer</Link></li>
                <li><Link to="/Coresspondantinterne/list">Lister</Link></li>
                <li><Link to="/Coresspondantinterne/edit">Éditer</Link></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={() => toggleSubsection('externe')}>Externe</button>
            {openSubsection === 'externe' && (
              <ul className="nav-sub-sub">
                <li><Link to="/CoresspondantExtern/create">Créer</Link></li>
                <li><Link to="/CoresspondantExtern/list">Lister</Link></li>
                <li><Link to="/CoresspondantExtern/edit">Éditer</Link></li>
              </ul>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}

export default SidebarNav;
