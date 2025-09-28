// src/pages/ListCourrierDepart.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import JsonTableAction from "../components/JsonTableAction";
import { fetchData } from "../components/fetchdata";
import FilterBar from "../components/FilterBar";

function ListCourrierDepart() {
  // raw & displayed rows
  const [allRows, setAllRows]         = useState([]);
  const [displayRows, setDisplayRows] = useState([]);

  // nature dropdown options
  const [natureOptions, setNatureOptions] = useState([
    { value: "", label: "Tous" }
  ]);

  // loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // endpoints
  const endpointCourrier = "http://localhost:8080/api/courrier/depart";
  const endpointNature   = "http://localhost:8080/api/nature-courrier/active";

  // must match keys in flattened objects
  const columnOrder = [
    "id",
    "objet",
    "dateCourrier",
    "ref_emission",
    "nature",
    "moyEnch",
    "correspondantExp",
    "correspondantDist",
    "numPli",
    "num_ord",
    "dateremise",
    "datesystem",
    "typeCourrier"
  ];

  // ── Load nature dropdown ─────────────────────────────────────
  useEffect(() => {
    axios
      .get(endpointNature)
      .then(resp => {
        const opts = resp.data.map(n => ({
          value: String(n.id),
          label: n.label
        }));
        setNatureOptions([{ value: "", label: "Tous" }, ...opts]);
      })
      .catch(err => console.error("Failed loading natures:", err));
  }, []);

  // ── Load and flatten depart courriers ────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchData(endpointCourrier, raw => {
      const flat = raw.map(item => ({
        id:               item.id,
        objet:            item.objet || "N/A",
        dateCourrier:     item.dateCourrier || "N/A",
        ref_emission:     item.ref_emission || "N/A",
        nature:           item.nature?.label || "N/A",
        moyEnch:          item.moyEnch?.label || "N/A",
        correspondantExp: item.correspondantExp?.name || "N/A",
        correspondantDist:item.correspondantDist?.name|| "N/A",
        numPli:           String(item.numPli   ?? "N/A"),
        num_ord:          String(item.num_ord  ?? "N/A"),
        dateremise:       item.dateremise      || "N/A",
        datesystem:       item.datesystem      || "N/A",
        typeCourrier:     item.typeCourrier?.label || "N/A"
      }));

      setAllRows(flat);
      setDisplayRows(flat);
      setLoading(false);
    }).catch(() => {
      setError("Erreur lors du chargement des données");
      setLoading(false);
    });
  }, []);

  // ── Filter handlers ───────────────────────────────────────────
  const applyFilters = ({ natureFilter, searchField, searchTerm }) => {
    let list = [...allRows];

    if (natureFilter) {
      const selectedLabel = natureOptions.find(n => n.value === natureFilter)?.label;
      list = list.filter(r => r.nature === selectedLabel);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(r =>
        (r[searchField] || "").toLowerCase().includes(term)
      );
    }

    setDisplayRows(list);
  };

  const resetFilters = () => {
    setDisplayRows(allRows);
  };

  // ── Render loading / error ───────────────────────────────────
  if (loading) {
    return <p style={{ padding: 16, textAlign: "center" }}>Chargement…</p>;
  }
  if (error) {
    return <p style={{ padding: 16, textAlign: "center", color: "red" }}>{error}</p>;
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <div style={{ padding: 16 }}>
      <h2>Liste des Courriers Départ</h2>
      <button
        onClick={() => { setDisplayRows(allRows); }}
        style={{
          marginBottom: 12,
          padding: "0.4rem 0.8rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Actualiser
      </button>

      <FilterBar
        natureOptions={natureOptions}
        searchFields={[
          { value: "num_ord",           label: "N° d’Ordre" },
          { value: "numPli",            label: "N° Pli" },
          { value: "dateCourrier",      label: "Date" },
          { value: "correspondantExp",  label: "Expéditeur" },
          { value: "correspondantDist", label: "Destinataire" }
        ]}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <div style={{ maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ minWidth: 1000 }}>
          {displayRows.length === 0 ? (
            <p>Aucun courrier trouvé.</p>
          ) : (
            <JsonTableAction
              data={displayRows}
              columnOrder={columnOrder}
              endpoint={endpointCourrier}
              setData={setDisplayRows}
              fetchData={() => setDisplayRows(allRows)}
              tableStyle={{ whiteSpace: "nowrap" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ListCourrierDepart;
