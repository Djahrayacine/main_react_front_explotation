// src/App.js
import React from "react";
import './styling.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoresspondantExtern from "./pages/CoresspondantExtern.js";
import Coresspondantinterne from "./pages/Coresspondantinterne.js";
import ChequePage from "./pages/ChequePage.js"; // Add this import
import Bignavbar from "./Bignavbar.js";
import CourrierArrive from "./pages/CourrierArrive";
import CourrierDepart from "./pages/CourrierDepart.js";
// debut app ⬇️
function App() {
  return (
    <Router>
      <Bignavbar />
      <Routes>
        <Route path="/CoresspondantExtern/*" element={<CoresspondantExtern />} />
        <Route path="/Coresspondantinterne/*" element={<Coresspondantinterne />} />
        <Route path="/cheques/*" element={<ChequePage />} /> {/* Add this route */}
         <Route path="/courrier/arrive/*" element={<CourrierArrive />} />
          <Route path="/courrier/depart/*" element={<CourrierDepart />} />
      </Routes>
    </Router>
  );
}

export default App; // ⬅️ fin du app