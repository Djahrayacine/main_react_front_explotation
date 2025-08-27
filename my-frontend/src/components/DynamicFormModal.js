import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicFormModal = ({ fields, endpoint, initialData, onSuccess }) => {
  // start with empty object then sync from initialData
  const [formData, setFormData] = useState({});

  // keep formData synced when modal opens / initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // create empty keyed object if you prefer
      setFormData({});
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send only the updated object (matches your Spring Boot @PutMapping)
      await axios.put(`${endpoint}/${initialData.idCC}`, formData);

      // call parent success handler (parent will close modal + refetch)
      onSuccess?.();

      alert("✅ Update successful!");
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px' }}>
          <h3>Current Values</h3>
          {fields.map(field => (
            <div key={`prev-${field}`}>
              <label>{field}</label>
              <input value={initialData?.[field] || ''} disabled />
            </div>
          ))}
        </div>

        <div>
          <h3>New Values</h3>
          {fields.map(field => (
            <div key={`new-${field}`}>
              <label>{field}</label>
              <input
                value={formData[field] ?? ''} // use ?? to allow empty strings
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                disabled={field === 'idCC'}
              />
            </div>
          ))}
        </div>
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default DynamicFormModal;
