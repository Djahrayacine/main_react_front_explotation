import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbarr from "../Navbarr"; // FIXED: Go up one level to find Navbarr
import CreateUser from "./CreateUser";
import ListUsers from "./ListUsers";

function UsersPage() {
  return (
    <div>
      <Navbarr basePath="/users" />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="create" element={<CreateUser />} />
          <Route path="list" element={<ListUsers />} />
          <Route path="" element={
            <div className="centered">
              <h2>Gestion des Utilisateurs</h2>
              <p>Sélectionnez une action dans le menu ci-dessus</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default UsersPage;