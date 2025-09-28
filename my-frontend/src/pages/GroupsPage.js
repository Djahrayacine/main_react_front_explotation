import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbarr from "../Navbarr";
import CreateGroup from "./CreateGroup";
import GroupsManagement from "./GroupsManagement";

function GroupsPage() {
  return (
    <div>
      <Navbarr basePath="/admin/groups" />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="create" element={<CreateGroup />} />
          <Route path="list" element={<GroupsManagement />} />
          <Route path="" element={
            <div className="centered">
              <h2>Gestion des Groupes</h2>
              <p>Sélectionnez une action dans le menu ci-dessus</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default GroupsPage;