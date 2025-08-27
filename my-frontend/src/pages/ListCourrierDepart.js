import React, { useEffect, useState } from "react";
import JsonTableAction from "../components/JsonTableAction";
import { fetchData } from "../components/fetchdata";

function ListCourrierDepart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columnOrder = [
    "id",
    "objet", 
    "dateCourrier",
    "ref_emission",
    "nature",
    "moyEnch",
    "correspondantExp",
    "correspondantDist",
    "numPli"
  ];
  const endpoint = "http://localhost:8080/api/courrier/depart";

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchData(endpoint, setData);
    } catch (err) {
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format nested objects for table display
  const formattedData = data.map((item) => ({
    ...item,
    correspondantExp: item.correspondantExp?.name || "N/A",
    correspondantDist: item.correspondantDist?.name || "N/A",
    nature: item.nature?.label || item.nature?.nom || item.nature?.libelle || "N/A",
    moyEnch: item.moyEnch?.label || item.moyEnch?.nom || item.moyEnch?.libelle || "N/A"
  }));

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <p>{error}</p>
        <button onClick={loadData}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Liste des Courriers Départ</h2>
        <button
          onClick={loadData}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Actualiser
        </button>
      </div>
      {formattedData.length === 0 ? (
        <p>Aucun courrier trouvé.</p>
      ) : (
        <JsonTableAction
          data={formattedData}
          columnOrder={columnOrder}
          endpoint={endpoint}
          setData={setData}
          fetchData={loadData}
        />
      )}
    </div>
  );
}

export default ListCourrierDepart;