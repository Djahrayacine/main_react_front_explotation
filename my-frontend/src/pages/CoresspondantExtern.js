// src/pages/CoresspondantExtern.js
import React from "react";
import { Routes, Route } from 'react-router-dom';

import Navbarr from "../Navbarr.js";
import CreateCorrespondantExterne from './CreateCorrespondantExterne';
import Listcorespandantexterne from './Listcorespandantexterne';

function CoresspondantExtern() {
  return (
    <div>
      <Navbarr basePath="/CoresspondantExtern" />
      <Routes>
        <Route path="/create" element={<CreateCorrespondantExterne />} />
        <Route path="/list" element={<Listcorespandantexterne />} />
      </Routes>
    </div>
  );
}

export default CoresspondantExtern;