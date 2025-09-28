import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function CreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    selectedGroups: []
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    
    // // Debug: log all cookies to see what's available
    // console.log("All cookies:", document.cookie);
    // console.log(`Looking for cookie '${name}', found:`, parts.length === 2 ? parts.pop().split(';').shift() : "NOT FOUND");
    
    return null;
  };

  // DEBUG: Check what's in the JWT token
  useEffect(() => {
    const token = getCookie("token");
    const accessiblePages = getCookie("accessiblePages");
    
    console.log("=== JWT DEBUG INFO ===");
    console.log("Raw token:", token ? token.substring(0, 50) + "..." : "NO TOKEN");
    console.log("Accessible pages cookie:", accessiblePages);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("FULL JWT PAYLOAD:", payload);
        console.log("Authorities in JWT:", payload.authorities || payload.roles || payload.auth || payload.scope || "NOT FOUND");
        
        // Check all possible authority fields
        Object.keys(payload).forEach(key => {
          if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('role') || key.toLowerCase().includes('scope')) {
            console.log(`Found authority field '${key}':`, payload[key]);
          }
        });
      } catch (e) {
        console.error("Error decoding JWT:", e);
      }
    }
    console.log("=== END DEBUG INFO ===");
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const token = getCookie("token");
      const response = await axios.get("http://localhost:8081/api/admin/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setMessage("❌ Error loading groups");
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupChange = (groupId) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getCookie("token");
      await axios.post("http://localhost:8081/api/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage("✅ Utilisateur créé avec succès!");
      setFormData({ username: "", password: "", selectedGroups: [] });
    } catch (error) {
      setMessage("❌ Erreur lors de la création: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Créer un Utilisateur</h2>
      </div>
      
      {message && (
        <div style={{ 
          padding: "1rem", 
          marginBottom: "1rem", 
          backgroundColor: message.includes("✅") ? "rgba(25, 135, 84, 0.2)" : "rgba(220, 53, 69, 0.2)",
          border: `1px solid ${message.includes("✅") ? "var(--success-color)" : "var(--danger-color)"}`,
          borderRadius: "var(--radius-md)",
          color: message.includes("✅") ? "var(--success-color)" : "var(--danger-color)"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Entrez le nom d'utilisateur"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Entrez le mot de passe"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Groupes assignés:</label>
          <div className="checkbox-group" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--spacing-md)",
            background: "var(--bg-input)",
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-secondary)"
          }}>
            {groups.length > 0 ? groups.map(group => (
              <label key={group.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.selectedGroups.includes(group.id)}
                  onChange={() => handleGroupChange(group.id)}
                />
                <span>
                  <strong>{group.name}</strong>
                  {group.description && <div style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
                    {group.description}
                  </div>}
                </span>
              </label>
            )) : (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                Aucun groupe disponible
              </p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "Création en cours..." : "Créer Utilisateur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;