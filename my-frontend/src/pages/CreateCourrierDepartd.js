import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicCourierForm = ({ courierType = 'depart' }) => {
  // Main courier data
  const [courierData, setCourierData] = useState({
    objet: '',
    dateCourrier: '',
    dateremise: '',
    datesystem: new Date().toISOString().split('T')[0], // Auto-set to today
    ref_emission: '',
    num_ord: '',
    natureId: '',
    moyEnchId: '',
    typeCourrieId: '', // Added
    idExp: '',
    idDist: '',
    numPli: courierType === 'depart' ? '' : undefined
  });

  // Content selection (what the courier contains)
  const [selectedContent, setSelectedContent] = useState({
    cheques: false,
    fauxBillets: false,
    documents: false
  });

  // Arrays for each content type
  const [cheques, setCheques] = useState([]);
  const [fauxBillets, setFauxBillets] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    natures: [],
    moyEnch: [],
    typeCourriers: [],
    correspondants: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [naturesRes, moyEnchRes, typeCourrierRes, interneRes, externeRes] = await Promise.all([
          axios.get('http://localhost:8080/api/nature-courrier'),
          axios.get('http://localhost:8080/api/moyen-enchainement'),
          axios.get('http://localhost:8080/api/type-courrier'),
          axios.get('http://localhost:8080/api/correspondants/interne'),
          axios.get('http://localhost:8080/api/correspondants/externe')
        ]);

        setDropdownOptions({
          natures: naturesRes.data,
          moyEnch: moyEnchRes.data,
          typeCourriers: typeCourrierRes.data,
          correspondants: [...interneRes.data, ...externeRes.data]
        });
      } catch (err) {
        setError('Erreur lors du chargement des options');
        console.error('Error loading options:', err);
      }
    };

    loadOptions();
  }, []);

  // Handle courier basic field changes
  const handleCourierChange = (e) => {
    const { name, value } = e.target;
    setCourierData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle content type selection
  const handleContentSelection = (contentType) => {
    setSelectedContent(prev => ({
      ...prev,
      [contentType]: !prev[contentType]
    }));

    // If unchecking, clear the array
    if (selectedContent[contentType]) {
      if (contentType === 'cheques') setCheques([]);
      if (contentType === 'fauxBillets') setFauxBillets([]);
      if (contentType === 'documents') setDocuments([]);
    }
  };

  // Add new item functions
  const addCheque = () => {
    setCheques(prev => [...prev, {
      numeroCheque: '',
      banque: '',
      montant: '',
      titulaire: '',
      devise: '',
      estCertifie: false
    }]);
  };

  const addFauxBillet = () => {
    setFauxBillets(prev => [...prev, {
      devise: '',
      nombreBillets: '',
      valeurFaciale: '',
      observation: ''
    }]);
  };

  const addDocument = () => {
    setDocuments(prev => [...prev, {
      reference: '',
      typeDocument: '',
      titre: '',
      observation: ''
    }]);
  };

  // Remove item functions
  const removeCheque = (index) => {
    setCheques(prev => prev.filter((_, i) => i !== index));
  };

  const removeFauxBillet = (index) => {
    setFauxBillets(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Update item functions
  const updateCheque = (index, field, value) => {
    setCheques(prev => prev.map((cheque, i) => 
      i === index ? { ...cheque, [field]: value } : cheque
    ));
  };

  const updateFauxBillet = (index, field, value) => {
    setFauxBillets(prev => prev.map((billet, i) => 
      i === index ? { ...billet, [field]: value } : billet
    ));
  };

  const updateDocument = (index, field, value) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    ));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Combine form data with dynamic content
    const submitData = {
      ...courierData,
      cheques: selectedContent.cheques ? cheques : [],
      fauxBillets: selectedContent.fauxBillets ? fauxBillets : [],
      documents: selectedContent.documents ? documents : []
    };

    try {
      const endpoint = `http://localhost:8080/api/courrier/${courierType}`;
      await axios.post(endpoint, submitData);
      alert(`Courrier ${courierType === 'arrive' ? 'arrivé' : 'départ'} créé avec succès!`);
      
      // Reset form
      setCourierData({
        objet: '',
        dateCourrier: '',
        dateremise: '',
        datesystem: new Date().toISOString().split('T')[0], // Reset to current date
        ref_emission: '',
        num_ord: '',
        natureId: '',
        moyEnchId: '',
        typeCourrieId: '',
        idExp: '',
        idDist: '',
        numPli: courierType === 'depart' ? '' : undefined
      });
      
      // Reset content
      setSelectedContent({ cheques: false, fauxBillets: false, documents: false });
      setCheques([]);
      setFauxBillets([]);
      setDocuments([]);
    } catch (err) {
      setError(`Erreur lors de la création du courrier`);
      console.error('Error creating courrier:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courier-form-container">
      <h2>Créer un Courrier {courierType === 'arrive' ? 'Arrivé' : 'Départ'}</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          
          <div className="form-group">
            <label>
              Objet *
            </label>
            <input
              type="text"
              name="objet"
              value={courierData.objet}
              onChange={handleCourierChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Date Courrier *
            </label>
            <input
              type="date"
              name="dateCourrier"
              value={courierData.dateCourrier}
              onChange={handleCourierChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Date Remise
            </label>
            <input
              type="date"
              name="dateremise"
              value={courierData.dateremise}
              onChange={handleCourierChange}
            />
          </div>

          <div className="form-group">
            <label>
              Date Système (lecture seule)
            </label>
            <input
              type="date"
              name="datesystem"
              value={courierData.datesystem}
              readOnly
              className="disabled-field"
            />
          </div>

          <div className="form-group">
            <label>
              Référence d'émission
            </label>
            <input
              type="text"
              name="ref_emission"
              value={courierData.ref_emission}
              onChange={handleCourierChange}
            />
          </div>

          <div className="form-group">
            <label>
              Numéro d'ordre
            </label>
            <input
              type="text"
              name="num_ord"
              value={courierData.num_ord}
              onChange={handleCourierChange}
            />
          </div>

          <div className="form-group">
            <label>
              Nature *
            </label>
            <select
              name="natureId"
              value={courierData.natureId}
              onChange={handleCourierChange}
              required
            >
              <option value="">Sélectionner...</option>
              {dropdownOptions.natures.map(nature => (
                <option key={nature.id} value={nature.id}>
                  {nature.label || nature.nom || nature.libelle}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Type de courrier
            </label>
            <select
              name="typeCourrieId"
              value={courierData.typeCourrieId}
              onChange={handleCourierChange}
            >
              <option value="">Sélectionner...</option>
              {dropdownOptions.typeCourriers.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label || type.nom || type.libelle}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Moyen d'enchaînement *
            </label>
            <select
              name="moyEnchId"
              value={courierData.moyEnchId}
              onChange={handleCourierChange}
              required
            >
              <option value="">Sélectionner...</option>
              {dropdownOptions.moyEnch.map(moyen => (
                <option key={moyen.id} value={moyen.id}>
                  {moyen.label || moyen.nom || moyen.libelle}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Expéditeur *
            </label>
            <select
              name="idExp"
              value={courierData.idExp}
              onChange={handleCourierChange}
              required
            >
              <option value="">Sélectionner...</option>
              {dropdownOptions.correspondants.map(corresp => (
                <option key={corresp.id || corresp.idCC} value={corresp.id || corresp.idCC}>
                  {corresp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Destinataire *
            </label>
            <select
              name="idDist"
              value={courierData.idDist}
              onChange={handleCourierChange}
              required
            >
              <option value="">Sélectionner...</option>
              {dropdownOptions.correspondants.map(corresp => (
                <option key={corresp.id || corresp.idCC} value={corresp.id || corresp.idCC}>
                  {corresp.name}
                </option>
              ))}
            </select>
          </div>

          {courierType === 'depart' && (
            <div className="form-group">
              <label>
                Numéro de pli
              </label>
              <input
                type="number"
                name="numPli"
                value={courierData.numPli}
                onChange={handleCourierChange}
              />
            </div>
          )}
        </div>

        {/* Content Selection */}
        <div className="content-selection">
          <h3>Contenu du courrier</h3>
          <p>Sélectionnez ce que contient ce courrier:</p>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedContent.cheques}
                onChange={() => handleContentSelection('cheques')}
              />
              Chèques
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedContent.fauxBillets}
                onChange={() => handleContentSelection('fauxBillets')}
              />
              Faux Billets
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedContent.documents}
                onChange={() => handleContentSelection('documents')}
              />
              Documentation
            </label>
          </div>
        </div>

        {/* Cheques Section */}
        {selectedContent.cheques && (
          <div className="content-section">
            <div className="section-header">
              <h3>Chèques ({cheques.length})</h3>
              <button type="button" onClick={addCheque} className="add-btn">
                + Ajouter Chèque
              </button>
            </div>
            
            {cheques.map((cheque, index) => (
              <div key={index} className="item-form">
                <div className="item-header">
                  <h4>Chèque #{index + 1}</h4>
                  <button type="button" onClick={() => removeCheque(index)} className="remove-btn">
                    Supprimer
                  </button>
                </div>
                
                <div className="item-fields">
                  <div className="form-group">
                    <label>Numéro de chèque:</label>
                    <input
                      type="text"
                      value={cheque.numeroCheque}
                      onChange={(e) => updateCheque(index, 'numeroCheque', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Banque:</label>
                    <input
                      type="text"
                      value={cheque.banque}
                      onChange={(e) => updateCheque(index, 'banque', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Montant:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cheque.montant}
                      onChange={(e) => updateCheque(index, 'montant', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Titulaire:</label>
                    <input
                      type="text"
                      value={cheque.titulaire}
                      onChange={(e) => updateCheque(index, 'titulaire', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Devise:</label>
                    <input
                      type="text"
                      value={cheque.devise}
                      onChange={(e) => updateCheque(index, 'devise', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={cheque.estCertifie}
                        onChange={(e) => updateCheque(index, 'estCertifie', e.target.checked)}
                      />
                      Certifié
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Faux Billets Section */}
        {selectedContent.fauxBillets && (
          <div className="content-section">
            <div className="section-header">
              <h3>Faux Billets ({fauxBillets.length})</h3>
              <button type="button" onClick={addFauxBillet} className="add-btn">
                + Ajouter Faux Billet
              </button>
            </div>
            
            {fauxBillets.map((billet, index) => (
              <div key={index} className="item-form">
                <div className="item-header">
                  <h4>Faux Billet #{index + 1}</h4>
                  <button type="button" onClick={() => removeFauxBillet(index)} className="remove-btn">
                    Supprimer
                  </button>
                </div>
                
                <div className="item-fields">
                  <div className="form-group">
                    <label>Devise:</label>
                    <input
                      type="text"
                      value={billet.devise}
                      onChange={(e) => updateFauxBillet(index, 'devise', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nombre de billets:</label>
                    <input
                      type="number"
                      value={billet.nombreBillets}
                      onChange={(e) => updateFauxBillet(index, 'nombreBillets', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Valeur faciale:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={billet.valeurFaciale}
                      onChange={(e) => updateFauxBillet(index, 'valeurFaciale', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Observation:</label>
                    <textarea
                      value={billet.observation}
                      onChange={(e) => updateFauxBillet(index, 'observation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents Section */}
        {selectedContent.documents && (
          <div className="content-section">
            <div className="section-header">
              <h3>Documents ({documents.length})</h3>
              <button type="button" onClick={addDocument} className="add-btn">
                + Ajouter Document
              </button>
            </div>
            
            {documents.map((doc, index) => (
              <div key={index} className="item-form">
                <div className="item-header">
                  <h4>Document #{index + 1}</h4>
                  <button type="button" onClick={() => removeDocument(index)} className="remove-btn">
                    Supprimer
                  </button>
                </div>
                
                <div className="item-fields">
                  <div className="form-group">
                    <label>Référence:</label>
                    <input
                      type="text"
                      value={doc.reference}
                      onChange={(e) => updateDocument(index, 'reference', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Type de document:</label>
                    <input
                      type="text"
                      value={doc.typeDocument}
                      onChange={(e) => updateDocument(index, 'typeDocument', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Titre:</label>
                    <input
                      type="text"
                      value={doc.titre}
                      onChange={(e) => updateDocument(index, 'titre', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Observation:</label>
                    <textarea
                      value={doc.observation}
                      onChange={(e) => updateDocument(index, 'observation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Création en cours...' : `Créer le Courrier ${courierType === 'arrive' ? 'Arrivé' : 'Départ'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicCourierForm;