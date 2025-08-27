import React, { useState } from "react";
import RowActions from "./RowActions";
import deleteItem from "./deleteItem";
import axios from "axios";
import ModalForm from "./ModalForm";
import {findIdKey} from "./findIdKey";
function JsonTableAction({ data, columnOrder = null, endpoint, setData,fetchData }) {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [editingRow, setEditingRow] = useState(null);
  //+++++++++++++++++++++++++++++++++++
  if (!data || data.length === 0) {
    return <p>no data ❌</p>;
  }

  // CHANGE: Use columnOrder instead of Object.keys
  const columns = columnOrder || Object.keys(data[0]);

  const toggleMenu = (rowIndex) => {
    setOpenMenuIndex(openMenuIndex === rowIndex ? null : rowIndex);
  };

  const handleClickOutside = () => {
    setOpenMenuIndex(null);
  };
  // In JsonTableAction.js
async function handleDelete(row) {
  const idKey = findIdKey(row);   // e.g. "IDCC"
  const idValue = row[idKey];     // e.g. 42

  const result = await deleteItem(endpoint, idValue);

  if (result.success) {
    alert("✅ Deleted successfully!");
    const response = await axios.get(endpoint);
    setData(response.data);
  } else {
    alert("❌ Delete failed!");
  }
}
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRow(null); // Reset editing row
  };
  const handleOpenModal = (row) => {
    setEditingRow(row);
    setOpenMenuIndex(null); // Always close menu when opening modal
    setIsModalOpen(true);
  };
  return (
    <div
      style={{ padding: "1rem", overflow: "visible" }}
      onClick={handleClickOutside}
    >
      <table onClick={(e) => e.stopPropagation()}>
     <ModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fields={columnOrder}
          endpoint={endpoint}
          initialData={editingRow}
          onSuccess={() => {
            // close modal and refresh list
            handleCloseModal();
            if (typeof fetchData === "function") fetchData();
          }}
        />
        <thead>
          <tr>
            {/* CHANGE: Use columns instead of Object.keys(data[0]) */}
            {columns.map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th key="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowindex) => (
            <tr key={rowindex}>
              {/* CHANGE: Use columns.map instead of Object.values */}
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
                    onEdit={handleOpenModal} // Use the new handler here
                    onDelete={(row) => {
                      setOpenMenuIndex(null); // Also close menu for delete
                      handleDelete(row);
                    }}
                    onView={(row) => {
                      setOpenMenuIndex(null); // Close menu for view
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
