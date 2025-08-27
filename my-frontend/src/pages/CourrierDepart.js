import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbarr from "../Navbarr.js";
import ListCourrierDepart from "./ListCourrierDepart.js";
import CreatecourrierDepartd from "./CreateCourrierDepartd.js";
function CourrierDepart() {
  return (
    <div>
      <Navbarr basePath="/courrier/depart" />
      <Routes>
       <Route path="create" element={<CreatecourrierDepartd />} />
        <Route path="list" element={<ListCourrierDepart />} />
      </Routes>
    </div>
  );
}

export default CourrierDepart;
