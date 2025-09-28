import React, { useState, useEffect } from 'react';
import JsonTableAction from "../components/JsonTableAction";

const GroupsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE = 'http://localhost:8081/api';

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/groups`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const raw = await res.json();
      const formatted = raw.map(g => ({
        ...g,
        accessiblePages: Array.isArray(g.accessiblePages) ? g.accessiblePages.join(', ') : ''
      }));
      setGroups(formatted);
      setError('');
    } catch (err) {
      setError(`Échec du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const groupColumns = ['id', 'name', 'description', 'accessiblePages'];

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Chargement...</div>;

  if (error) return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div style={{ background: '#fee', color: '#c33', padding: 15, borderRadius: 5 }}>{error}</div>
      <button onClick={fetchGroups} style={{ marginTop: 10, padding: '8px 16px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: 4 }}>
        Réessayer
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 10, borderBottom: '2px solid #0d6efd', paddingBottom: 5 }}>Gestion des groupes</h2>

      {groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <h3>Aucun groupe trouvé</h3>
          <p>Commencez par en créer un</p>
        </div>
      ) : (
        <JsonTableAction
          data={groups}
          columnOrder={groupColumns}
          endpoint={`${API_BASE}/admin/groups`}
          setData={setGroups}
          fetchData={fetchGroups}
        />
      )}
    </div>
  );
};

export default GroupsManagement;
