import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { validateToken } from "./utils/validateToken";
import Bignavbar from "./Bignavbar";
import CoresspondantExtern from "./pages/CoresspondantExtern";
import Coresspondantinterne from "./pages/Coresspondantinterne";
import ChequePage from "./pages/ChequePage";
import CourrierArrive from "./pages/CourrierArrive";
import CourrierDepart from "./pages/CourrierDepart";
import './styling.css';
import CourrierSearch from "./components/CourrierSearch";
import GroupsManagement from "./pages/GroupsManagement";
function readCookie(name) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] || '';
  
  return name === 'accessiblePages' ? decodeURIComponent(value) : value;
}

function App() {
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken()
      .then(setTokenValid)
      .catch(() => setTokenValid(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!tokenValid) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Session expired or invalid token</h2>
        <p>Please login first:</p>
        <a href="http://localhost:3000" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}>
          Go to Login
        </a>
      </div>
    );
  }


  const accessiblePagesStr = readCookie('accessiblePages');
  const accessiblePages = accessiblePagesStr ? accessiblePagesStr.split(',') : [];


  console.log('Accessible pages:', accessiblePages);
  console.log('Raw cookie value:', accessiblePagesStr);

  return (
    <Router>
      <Bignavbar />
      <Routes>
        <Route path="/courrier/search" element={
  accessiblePages.includes('CourrierSearch') ? 
    <CourrierSearch /> : 
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
} />
        <Route path="/CoresspondantExtern/*" element={
          accessiblePages.includes('CoresspondantExtern') ? 
            <CoresspondantExtern /> : 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
        } />
        
        <Route path="/Coresspondantinterne/*" element={
          accessiblePages.includes('Coresspondantinterne') ? 
            <Coresspondantinterne /> : 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
        } />
        
        <Route path="/cheques/*" element={
          accessiblePages.includes('ChequePage') ? 
            <ChequePage /> : 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
        } />
        
        <Route path="/courrier/arrive/*" element={
          accessiblePages.includes('CourrierArrive') ? 
            <CourrierArrive /> : 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
        } />
        
        <Route path="/courrier/depart/*" element={
          accessiblePages.includes('CourrierDepart') ? 
            <CourrierDepart /> : 
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
        } />
        
        {/* Default route */}
        <Route path="/" element={
          <div style={{ padding: '20px' }}>
            <h1>Welcome to the Application</h1>
            <p>Your accessible pages: {accessiblePages.join(', ')}</p>
          </div>
        } />


<Route path="/admin/groups" element={
  accessiblePages.includes('ADMIN') ? 
    <GroupsManagement /> : 
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
} />
      </Routes>
    </Router>
  );
}

export default App;