import React from "react";

function RowActions({ row, isOpen, onEdit, onDelete, onView }) {
  if (!isOpen) return null;
  
  return (
    <div className="actions-menu" onClick={(e) => e.stopPropagation()}>
      <button 
        className="action-btn edit-btn"
        onClick={() => onEdit(row)}
      >
        🛠️ Modifier
      </button>
      <button 
        className="action-btn delete-btn"
        onClick={() => onDelete(row)}
      >
        🗑️ Supprimer
      </button>
      <button 
        className="action-btn view-btn"
        onClick={() => onView(row)}
      >
        ◉ Voir détails
      </button>
    </div>
  );
}

export default RowActions;