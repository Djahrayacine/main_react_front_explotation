import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function FilterBar({ 
  natureOptions, 
  searchFields, 
  onApply, 
  onReset 
}) {
  const [natureFilter, setNatureFilter] = useState("");
  const [searchField, setSearchField] = useState(
    searchFields.length ? searchFields[0].value : ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  // if searchFields prop ever changes, reinitialize the selector
  useEffect(() => {
    if (searchFields.length) {
      setSearchField(searchFields[0].value);
    }
  }, [searchFields]);

  const handleApply = () => {
    onApply({ natureFilter, searchField, searchTerm });
  };

  const handleReset = () => {
    setNatureFilter("");
    setSearchField(searchFields.length ? searchFields[0].value : "");
    setSearchTerm("");
    onReset();
  };

  return (
    <div style={{
      marginBottom: "1rem",
      display: "flex",
      gap: "0.75rem",
      alignItems: "center"
    }}>
      <label>
        Nature:
        <select
          value={natureFilter}
          onChange={e => setNatureFilter(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {natureOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Recherche:
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {searchFields.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="terme…"
        style={{ padding: "0.25rem", flexGrow: 1 }}
      />

      <button 
        onClick={handleApply} 
        style={{ padding: "0.4rem 0.8rem" }}
      >
        OK
      </button>
      <button 
        onClick={handleReset} 
        style={{ padding: "0.4rem 0.8rem" }}
      >
        Annuler
      </button>
    </div>
  );
}

FilterBar.propTypes = {
  natureOptions: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  searchFields: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default FilterBar;
