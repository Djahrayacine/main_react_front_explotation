import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './stylists';

const ListCorrespondants = () => {
  const [correspondants, setCorrespondants] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/correspondants/externe')
      .then(response => setCorrespondants(response.data))
      .catch(error => console.error('Erreur chargement:', error));
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action, id) => {
    alert(`${action} correspondant ID: ${id}`);
    setOpenMenuId(null);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>🌴 Liste des Correspondants Externes</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Adresse</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Téléphone</th>
            <th style={styles.th}>Fax</th>
            <th style={styles.th}>⋯</th>
          </tr>
        </thead>
        <tbody>
          {correspondants.map(c => (
            <tr key={c.id} style={styles.tr}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.adresse}</td>
              <td style={styles.td}>{c.e_mail}</td>
              <td style={styles.td}>{c.phone_num}</td>
              <td style={styles.td}>{c.fax}</td>
              <td style={styles.td}>
                <div style={styles.menuWrapper}>
                  <button style={styles.menuButton} onClick={() => toggleMenu(c.id)}>⋯</button>
                  {openMenuId === c.id && (
                    <div style={styles.menu}>
                      <div style={styles.menuItem} onClick={() => handleAction('View', c.id)}>👁️ View</div>
                      <div style={styles.menuItem} onClick={() => handleAction('Modify', c.id)}>✏️ Modify</div>
                      <div style={styles.menuItem} onClick={() => handleAction('Delete', c.id)}>🗑️ Delete</div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCorrespondants;
