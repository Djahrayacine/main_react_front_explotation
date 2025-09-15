import React, { useState, useEffect, useCallback } from 'react';
import JsonTableAction from "../components/JsonTableAction";

const GroupsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8081/api';

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/admin/groups`, {
        credentials: 'include',  // This sends cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform data for the table - flatten accessiblePages
      const transformedData = data.map(group => ({
        ...group,
        accessiblePages: Array.isArray(group.accessiblePages) 
          ? group.accessiblePages.join(', ') 
          : ''
      }));
      
      setGroups(transformedData);
      setError('');
    } catch (err) {
      setError(`Failed to fetch groups: ${err.message}`);
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get cookie
  const getCookie = (name) => {
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] || '';
    return value;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Column order for the table
  const groupColumns = ['id', 'name', 'description', 'accessiblePages'];

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fee', 
          color: '#c33', 
          border: '1px solid #fcc',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
        <button onClick={fetchGroups} style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#333', 
          borderBottom: '2px solid #007bff', 
          paddingBottom: '10px',
          marginBottom: '10px'
        }}>
          Groups Management
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage user groups and their accessible pages
        </p>
      </div>

      {groups.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Groups Found</h3>
          <p style={{ color: '#6c757d' }}>Start by creating your first group</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <JsonTableAction
            data={groups}
            columnOrder={groupColumns}
            endpoint={`${API_BASE}/admin/groups`}
            setData={setGroups}
            fetchData={fetchGroups}
          />
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ color: '#495057', marginBottom: '10px' }}>Instructions:</h4>
        <ul style={{ color: '#6c757d', paddingLeft: '20px' }}>
          <li>Click the menu (⋮) on each row to Edit, Delete, or View group details</li>
          <li>Use "Créer" to add a new group</li>
          <li>Accessible Pages should be comma-separated (e.g., "CourrierArrive,CourrierDepart")</li>
          <li>Make sure to assign appropriate pages for each user group</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupsManagement;