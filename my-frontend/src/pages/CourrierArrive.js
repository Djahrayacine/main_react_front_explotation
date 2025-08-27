import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbarr from "../Navbarr.js";
import CreateCourrierArrive from "./CreateCourrierArrive";
import ListCourrierArrive from "./ListCourrierArrive";

function CourrierArrive() {
  return (
    <div>
      <Navbarr basePath="/courrier/arrive" />
      <Routes>
        <Route path="create" element={<CreateCourrierArrive />} />
        <Route path="list" element={<ListCourrierArrive />} />
      </Routes>
    </div>
  );
}

export default CourrierArrive;
