import React, { useEffect, useState } from "react";
import JsonTableAction from "../components/JsonTableAction";
import { fetchData } from "../components/fetchdata";

function Listcorespandantexterne() {
  const [data, setData] = useState([]);
  const columnOrder = ["idCC", "name", "adresse", "phone_num", "fax", "e_mail"];
  const endpoint = "http://localhost:8080/api/correspondants/externe";

  useEffect(() => {
    fetchData(endpoint, setData);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Liste des Correspondants Externes</h2>
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

export default Listcorespandantexterne;