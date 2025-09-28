import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import JsonTableAction from "../components/JsonTableAction";


function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getCookie("token");
      const response = await axios.get("http://localhost:8081/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Transform the data to show group names instead of objects
      const transformedUsers = response.data.map(user => ({
        ...user,
        groups: user.groups.map(group => group.name).join(", ") || "Aucun groupe"
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        setError("❌ Non autorisé - Veuillez vous connecter");
      } else if (error.response?.status === 403) {
        setError("❌ Accès refusé - Permissions insuffisantes");
      } else {
        setError("❌ Erreur lors du chargement des utilisateurs");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columnOrder = ["id", "username", "groups"];

  if (loading) {
    return (
      <div className="centered">
        <h2>Chargement...</h2>
        <p>Récupération des utilisateurs en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered">
        <h2 style={{ color: "var(--danger-color)" }}>Erreur</h2>
        <p style={{ color: "var(--danger-color)", marginBottom: "var(--spacing-lg)" }}>{error}</p>
        <button 
          onClick={() => { 
            setError(""); 
            fetchUsers(); 
          }}
          className="cyberpunk-btn"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Liste des Utilisateurs</h2>
        <button 
          onClick={fetchUsers} 
          className="cyberpunk-btn"
          style={{ minWidth: "auto", padding: "0.5rem 1rem" }}
        >
          🔄 Actualiser
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="centered">
          <p className="no-data">Aucun utilisateur trouvé</p>
          <p style={{ color: "var(--text-muted)", marginTop: "var(--spacing-md)" }}>
            Créez votre premier utilisateur en utilisant le menu "Créer" ci-dessus
          </p>
        </div>
      ) : (
        <div className="table-container">
          <JsonTableAction
            data={users}
            columnOrder={columnOrder}
            endpoint="http://localhost:8081/api/admin/users"
            setData={setUsers}
            fetchData={fetchUsers}
          />
        </div>
      )}
    </div>
  );
}

export default ListUsers;