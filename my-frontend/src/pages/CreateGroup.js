import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessiblePages: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 
  const availablePages = [
    "CourrierDepart",
    "CourrierSearch", 
    "ChequePage",
    "CourrierArrive",
    "Coresspondantinterne",
    "ADMIN",
    "CoresspondantExtern",
    "admin_dashboard",
    "user_profile",
    "manager_reports",
    "common_home"
  ];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Create axios instance with token interceptor
  const createAxiosInstance = () => {
    const instance = axios.create({
      baseURL: 'http://localhost:8081/api',
      withCredentials: true
    });

    // Add token to all requests
    instance.interceptors.request.use((config) => {
      const token = getCookie("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401/403 responses
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setMessage("❌ Session expirée - Veuillez vous reconnecter");
        } else if (error.response?.status === 403) {
          setMessage("❌ Accès refusé - Permissions insuffisantes");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  };

  // Check and validate token on component mount
  useEffect(() => {
    const token = getCookie("token");
    
    console.log("=== JWT DEBUG INFO (CreateGroup) ===");
    console.log("Raw token:", token ? "FOUND TOKEN" : "NO TOKEN");
    
    if (!token) {
      setMessage("❌ Aucun token d'authentification trouvé. Veuillez vous connecter.");
      return;
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("JWT Username:", payload.sub || payload.username);
      console.log("JWT Authorities:", payload.authorities || payload.roles || payload.groups);
      console.log("JWT Expires:", new Date(payload.exp * 1000));
      
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        setMessage("❌ Token expiré - Veuillez vous reconnecter");
        return;
      }
      
    } catch (e) {
      console.error("Error decoding JWT:", e);
      setMessage("❌ Token invalide - Veuillez vous reconnecter");
    }
    console.log("=== END DEBUG INFO ===");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (page) => {
    setFormData(prev => ({
      ...prev,
      accessiblePages: prev.accessiblePages.includes(page)
        ? prev.accessiblePages.filter(p => p !== page)
        : [...prev.accessiblePages, page]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getCookie("token");
      if (!token) {
        setMessage("❌ Aucun token trouvé - Veuillez vous connecter");
        return;
      }

      const api = createAxiosInstance();
      await api.post("/admin/groups", formData);
      
      setMessage("✅ Groupe créé avec succès!");
      setFormData({ name: "", description: "", accessiblePages: [] });
    } catch (error) {
      console.error("Error creating group:", error);
      if (error.response?.status === 403) {
        setMessage("❌ Accès refusé - Vous n'avez pas les permissions pour créer des groupes");
      } else if (error.response?.status === 401) {
        setMessage("❌ Session expirée - Veuillez vous reconnecter");
      } else {
        setMessage("❌ Erreur lors de la création: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Show login message if no token
  const token = getCookie("token");
  if (!token) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Créer un Groupe</h2>
        </div>
        <div style={{ 
          padding: "2rem", 
          textAlign: "center",
          backgroundColor: "rgba(220, 53, 69, 0.1)",
          border: "1px solid rgba(220, 53, 69, 0.3)",
          borderRadius: "var(--radius-md)",
          color: "var(--danger-color)"
        }}>
          <h3>❌ Authentification requise</h3>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <p>Veuillez vous connecter avec un compte administrateur.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Créer un Groupe</h2>
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
            <label htmlFor="name">Nom du groupe:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Entrez le nom du groupe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Entrez la description du groupe"
              rows="3"
              style={{ 
                width: "100%", 
                padding: "8px", 
                borderRadius: "4px", 
                border: "1px solid #ccc",
                fontFamily: "inherit"
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pages accessibles:</label>
          <div className="checkbox-group" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "var(--spacing-md)",
            background: "var(--bg-input)",
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-secondary)"
          }}>
            {availablePages.map(page => (
              <label key={page} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.accessiblePages.includes(page)}
                  onChange={() => handlePageChange(page)}
                />
                <span>
                  <strong>{page}</strong>
                  <div style={{ fontSize: "0.85em", color: "var(--text-muted)" }}>
                    {page.includes("admin") ? "Page d'administration" : 
                     page.includes("user") ? "Page utilisateur" : 
                     page.includes("manager") ? "Page gestionnaire" : 
                     "Page de l'application"}
                  </div>
                </span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9em", color: "var(--text-muted)" }}>
            Pages sélectionnées: {formData.accessiblePages.length}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "Création en cours..." : "Créer Groupe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup; 