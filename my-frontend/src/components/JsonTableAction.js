import React, { useState } from "react";
import RowActions from "./RowActions";
import deleteItem from "./deleteItem";
import axios from "axios";
import ModalForm from "./ModalForm";
import { findIdKey } from "./findIdKey";

function JsonTableAction({ data, columnOrder = null, endpoint, setData, fetchData }) {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // 🧠 Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!data || data.length === 0) {
    return <p>no data ❌</p>;
  }

  // 🧱 Columns to display
  const columns = columnOrder || Object.keys(data[0]);

  // 🔁 Toggle row menu
  const toggleMenu = (rowIndex) => {
    setOpenMenuIndex(openMenuIndex === rowIndex ? null : rowIndex);
  };

  const handleClickOutside = () => {
    setOpenMenuIndex(null);
  };

  // 🗑️ Delete handler
  async function handleDelete(row) {
    const idKey = findIdKey(row);
    const idValue = row[idKey];
    const result = await deleteItem(endpoint, idValue);

    if (result.success) {
      alert("✅ Deleted successfully!");
      const response = await axios.get(endpoint);
      setData(response.data);
    } else {
      alert("❌ Delete failed!");
    }
  }

  // ✏️ Modal handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRow(null);
  };

  const handleOpenModal = (row) => {
    setEditingRow(row);
    setOpenMenuIndex(null);
    setIsModalOpen(true);
  };

  // 🔼 Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // 🧠 Sort data before rendering
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const valA = String(a[sortField] || "").toLowerCase();
    const valB = String(b[sortField] || "").toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <div style={{ padding: "1rem", overflow: "visible" }} onClick={handleClickOutside}>
      <table onClick={(e) => e.stopPropagation()}>
        <ModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fields={columnOrder}
          endpoint={endpoint}
          initialData={editingRow}
          onSuccess={() => {
            handleCloseModal();
            if (typeof fetchData === "function") fetchData();
          }}
        />
        <thead>
          <tr>
            {columns.map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {key}
                {sortField === key && (sortAsc ? " 🔼" : " 🔽")}
              </th>
            ))}
            <th key="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowindex) => (
            <tr key={rowindex}>
              {columns.map((key, cellindex) => (
                <td key={cellindex}>{String(row[key] || "")}</td>
              ))}
              <td key="actions">
                <div className="menu-wrapper">
                  <button
                    className="menu-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(rowindex);
                    }}
                  >
                    ⋮
                  </button>
                  <RowActions
                    row={row}
                    isOpen={openMenuIndex === rowindex}
                    onEdit={handleOpenModal}
                    onDelete={(row) => {
                      setOpenMenuIndex(null);
                      handleDelete(row);
                    }}
                    onView={(row) => {
                      setOpenMenuIndex(null);
                      alert(`View: ${row.name}`);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JsonTableAction;
