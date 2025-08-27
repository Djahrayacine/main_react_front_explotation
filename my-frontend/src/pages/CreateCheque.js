// src/pages/CreateCheque.js
import React from "react";
import DynamicForm from "../components/DynamicForm";

function CreateCheque() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Créer un Chèque</h2>
      <DynamicForm
        endpoint="http://localhost:8080/api/cheques"
        fields={[
          "numeroCheque",
          "banque",
          "montant",
          "titulaire",
          "devise",
          "estCertifie",
          "courrier" // ⚠️ this is a relation, might need a dropdown later
        ]}
      />
    </div>
  );
}

export default CreateCheque;
