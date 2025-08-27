// src/pages/ChequePage.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbarr from "../Navbarr.js";
import CreateCheque from "./CreateCheque";
import ListCheque from "./ListCheque";

function ChequePage() {
  return (
    <div>
      <Navbarr basePath="/cheques" />
      <Routes>
        
        <Route path="/create" element={<CreateCheque />} />
        <Route path="/list" element={<ListCheque />} />
      </Routes>
    </div>
  );
}

export default ChequePage;
