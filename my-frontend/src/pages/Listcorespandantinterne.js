// src/pages/Listcorespandantinterne.js
import React, { useEffect, useState } from "react";
import JsonTableAction from "../components/JsonTableAction";
import { fetchData } from "../components/fetchdata";


function Listcorespandantinterne() {
  const [data, setData] = useState([]);
  const columnOrder = ["idCC", "name"];
  const endpoint = "http://localhost:8080/api/correspondants/interne";

  useEffect(() => {
    fetchData(endpoint, setData);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Liste des Correspondants interne</h2>
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

export default Listcorespandantinterne;
