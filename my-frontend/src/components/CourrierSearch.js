import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, FileText, Filter, X } from 'lucide-react';

const CourrierSearch = () => {
  const [courrierType, setCourrierType] = useState('arrive'); // 'arrive' or 'depart'
  const [searchType, setSearchType] = useState(''); // 'nature', 'date', 'expediteur', 'destinataire'
  const [searchValue, setSearchValue] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [natures, setNatures] = useState([]);
  const [correspondants, setCorrespondants] = useState([]);

  // FIXED: Correct API URL and added auth
  const API_BASE = 'http://localhost:8080/api';

  // Load dropdown data on component mount
  useEffect(() => {
    loadNatures();
    loadCorrespondants();
  }, []);

  const loadNatures = async () => {
    try {
      const response = await fetch(`${API_BASE}/nature-courrier`, {
        credentials: 'include', // FIXED: Added auth
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNatures(data);
      }
    } catch (err) {
      console.error('Error loading natures:', err);
    }
  };

  const loadCorrespondants = async () => {
    try {
      // FIXED: Updated endpoints to match your backend
      const [interneResponse, externeResponse] = await Promise.all([
        fetch(`${API_BASE}/correspondants/interne`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(`${API_BASE}/correspondants/externe`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      const interneData = interneResponse.ok ? await interneResponse.json() : [];
      const externeData = externeResponse.ok ? await externeResponse.json() : [];

      setCorrespondants([...interneData, ...externeData]);
    } catch (err) {
      console.error('Error loading correspondants:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchType) {
      setError('Veuillez sélectionner un type de recherche');
      return;
    }

    if (searchType === 'date' && !searchDate) {
      setError('Veuillez sélectionner une date');
      return;
    }

    if (searchType !== 'date' && !searchValue) {
      setError('Veuillez saisir une valeur de recherche');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // FIXED: Simplified endpoint structure
      let endpoint = `${API_BASE}/courrier/${courrierType}/search`;
      let params = new URLSearchParams();

      switch (searchType) {
        case 'nature':
          params.append('type', 'nature');
          params.append('value', searchValue);
          break;
        case 'date':
          params.append('type', 'date');
          params.append('value', searchDate);
          break;
        case 'expediteur':
          if (courrierType === 'arrive') {
            params.append('type', 'expediteur');
            params.append('value', searchValue);
          } else {
            setError('Recherche par expéditeur disponible uniquement pour les courriers arrivés');
            setLoading(false);
            return;
          }
          break;
        case 'destinataire':
          if (courrierType === 'depart') {
            params.append('type', 'destinataire');
            params.append('value', searchValue);
          } else {
            setError('Recherche par destinataire disponible uniquement pour les courriers départ');
            setLoading(false);
            return;
          }
          break;
        default:
          setError('Type de recherche non supporté');
          setLoading(false);
          return;
      }

      const response = await fetch(`${endpoint}?${params}`, {
        credentials: 'include', // FIXED: Added auth
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);

      if (data.length === 0) {
        setError('Aucun résultat trouvé');
      }
    } catch (err) {
      setError(`Erreur lors de la recherche: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchType('');
    setSearchValue('');
    setSearchDate('');
    setResults([]);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Recherche de Courrier</h1>
        <p className="text-gray-600">Recherchez vos courriers par différents critères</p>
      </div>

      {/* Search Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Courrier Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de courrier
            </label>
            <select
              value={courrierType}
              onChange={(e) => {
                setCourrierType(e.target.value);
                clearSearch();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="arrive">Courrier Arrivé</option>
              <option value="depart">Courrier Départ</option>
            </select>
          </div>

          {/* Search Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher par
            </label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue('');
                setSearchDate('');
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir un critère</option>
              <option value="nature">Nature du courrier</option>
              <option value="date">Date du courrier</option>
              {courrierType === 'arrive' && <option value="expediteur">Expéditeur</option>}
              {courrierType === 'depart' && <option value="destinataire">Destinataire</option>}
            </select>
          </div>

          {/* Search Value */}
          {searchType && searchType !== 'date' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'nature' ? 'Nature' : 
                 searchType === 'expediteur' ? 'Expéditeur' : 'Destinataire'}
              </label>
              {searchType === 'nature' ? (
                <select
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une nature</option>
                  {natures.map((nature) => (
                    <option key={nature.id} value={nature.id}>
                      {nature.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="ID ou nom du correspondant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          )}

          {/* Date Search */}
          {searchType === 'date' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date du courrier
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
            
            <button
              onClick={clearSearch}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Résultats de la recherche ({results.length} courrier{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réf. Émission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinataire
                  </th>
                  {courrierType === 'depart' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Pli
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((courrier) => (
                  <tr key={courrier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {courrier.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(courrier.dateCourrier)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={courrier.objet}>
                        {courrier.objet}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {courrier.ref_emission}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#111827' }}>
                      {courrier.nature?.label || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {courrier.correspondantExp?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {courrier.correspondantDist?.name || 'N/A'}
                    </td>
                    {courrierType === 'depart' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {courrier.numPli || 'N/A'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {results.length === 0 && !loading && !error && searchType && (
        <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
          📄
          <p style={{ color: '#6c757d', marginTop: '16px' }}>Effectuez une recherche pour voir les résultats</p>
        </div>
      )}
    </div>
  );
};

export default CourrierSearch;