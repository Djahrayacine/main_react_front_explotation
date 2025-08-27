// src/pages/Coresspondantinterne.js
import React from "react";
import { Routes, Route } from 'react-router-dom';

import Navbarr from "../Navbarr.js";
import CreateCorrespondantinterne from './CreateCorrespondantinterne';
import Listcorespandantinterne from './Listcorespandantinterne';

function Coresspondantinterne() {
  return (
    <div>
      <Navbarr basePath="/Coresspondantinterne" />
      <Routes>
        <Route path="/create" element={<CreateCorrespondantinterne />} />
        <Route path="/list" element={<Listcorespandantinterne />} />
      </Routes>
    </div>
  );
}

export default Coresspondantinterne;