// src/pages/ListCheque.js
import React, { useEffect, useState } from "react";
import JsonTableAction from "../components/JsonTableAction";
import { fetchData } from "../components/fetchdata";

function ListCheque() {
  const [data, setData] = useState([]);
  const columnOrder = [
    "id",
    "numeroCheque",
    "banque",
    "montant",
    "titulaire",
    "devise",
    "estCertifie",
    "courrier"
  ];
  const endpoint = "http://localhost:8080/api/cheques";

  useEffect(() => {
    fetchData(endpoint, setData);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Liste des Chèques</h2>
      <JsonTableAction
        data={data}
        columnOrder={columnOrder}
        endpoint={endpoint}
        setData={setData}
        fetchData={() => fetchData(endpoint, setData)}
      />
    </div>
  );
}

export default ListCheque;
