import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DynamicForm({ fields, endpoint, initialData, onSuccess }) {
  const [formData, setFormData] = useState(
    initialData || Object.fromEntries(
      fields.map(field => {
        if (typeof field === 'object') {
          return [field.name, field.defaultValue || ''];
        }
        return [field, ''];
      })
    )
  );
  
  // Store loaded options for select fields
  const [fieldOptions, setFieldOptions] = useState({});

  // Load options for fields that have endpoints
  useEffect(() => {
    const loadOptions = async () => {
      const optionsToLoad = fields.filter(field => 
        typeof field === 'object' && field.endpoint
      );

      for (const field of optionsToLoad) {
        try {
          const response = await axios.get(field.endpoint);
          setFieldOptions(prev => ({
            ...prev,
            [field.name]: response.data
          }));
        } catch (error) {
          console.error(`Error loading options for ${field.name}:`, error);
        }
      }
    };

    loadOptions();
  }, [fields]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    if (type === 'number') {
      processedValue = value ? parseInt(value) : null;
    } else if (type === 'date') {
      processedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending data:', formData);
      await axios.post(endpoint, formData);
      alert('✅ Record created!');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('❌ Error creating record');
      console.error('Full error:', err.response?.data || err);
    }
  };

  const renderField = (field) => {
    const fieldName = typeof field === 'object' ? field.name : field;
    const fieldType = typeof field === 'object' ? field.type : 'text';

    if (fieldType === 'select') {
      // Use loaded options if available, otherwise use static options
      const options = fieldOptions[fieldName] || field.options || [];
      
      return (
        <select
          id={fieldName}
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionner...</option>
          {field.endpoint ? (
            // For endpoint-loaded options, use displayField and valueField
            options.map(option => (
              <option 
                key={option[field.valueField || 'id']} 
                value={option[field.valueField || 'id']}
              >
                {option[field.displayField || 'label']}
              </option>
            ))
          ) : (
            // For static options
            options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          )}
        </select>
      );
    }

    // Determine input type
    let inputType = 'text';
    if (fieldName === 'dateCourrier') inputType = 'date';
    if (fieldName.includes('id') || fieldName.includes('Id')) inputType = 'number';
    if (fieldType === 'number') inputType = 'number';
    if (fieldType === 'date') inputType = 'date';

    return (
      <input
        id={fieldName}
        name={fieldName}
        type={inputType}
        value={formData[fieldName] || ''}
        onChange={handleChange}
        placeholder={fieldName}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {fields.map(field => {
        const fieldName = typeof field === 'object' ? field.name : field;
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            {renderField(field)}
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;