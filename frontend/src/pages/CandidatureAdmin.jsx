import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import CandidatureCard from "../components/canditatCard";

export default function Candidatures() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allCandidats, setAllCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState('local'); // 'local' ou 'server'

  const [filters, setFilters] = useState({
    searchName: "",
    poste: "",
    statut: "",
    competences: [],
    testValide: "",
    minExperienceMonths: "",
  });

  const [draft, setDraft] = useState({
    ...filters,
    competencesInput: "",
  });

  // Statistiques rapides
  const stats = useMemo(() => {
    const total = allCandidats.length;
    const acceptes = allCandidats.filter(c => c.statut === 'Accepté').length;
    const attente = allCandidats.filter(c => c.statut === 'En attente').length;
    const rejetes = allCandidats.filter(c => c.statut === 'Rejeté').length;
    const avecTest = allCandidats.filter(c => c.testResult?.score !== undefined).length;
    
    return { total, acceptes, attente, rejetes, avecTest };
  }, [allCandidats]);

  // Filtrage intelligent côté client
  const candidatsFiltres = useMemo(() => {
    let filtered = [...allCandidats];

    if (filters.searchName.trim()) {
      const search = filters.searchName.toLowerCase().trim();
      filtered = filtered.filter(c => {
        const nom = (c.user?.nom || '').toLowerCase();
        const prenoms = (c.user?.prenoms || '').toLowerCase();
        const fullName = `${nom} ${prenoms}`.toLowerCase();
        
        return nom.includes(search) || 
               prenoms.includes(search) || 
               fullName.includes(search);
      });
    }

    if (filters.poste.trim()) {
      const poste = filters.poste.toLowerCase().trim();
      filtered = filtered.filter(c => 
        (c.offre?.titre || '').toLowerCase().includes(poste)
      );
    }

    if (filters.statut) {
      filtered = filtered.filter(c => c.statut === filters.statut);
    }

    if (filters.competences.length > 0) {
      filtered = filtered.filter(c =>
        filters.competences.some(filterComp =>
          c.competences?.some(candidateComp => 
            candidateComp.toLowerCase().includes(filterComp.toLowerCase())
          )
        )
      );
    }

    if (filters.testValide) {
      filtered = filtered.filter(c =>
        filters.testValide === "oui"
          ? c.testResult?.score !== undefined
          : c.testResult?.score === undefined
      );
    }

    if (filters.minExperienceMonths) {
      const minExp = Number(filters.minExperienceMonths);
      filtered = filtered.filter(c =>
        c.experiences?.some(exp => Number(exp.duree) >= minExp)
      );
    }

    return filtered;
  }, [allCandidats, filters]);

  const setDraftField = (field, value) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const hasActiveFilters = useMemo(() => {
    return filters.searchName || filters.poste || filters.statut || 
           filters.competences.length > 0 || filters.testValide || 
           filters.minExperienceMonths;
  }, [filters]);

  const onApply = (e) => {
    e?.preventDefault?.();

    const comps = (draft.competencesInput || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const newFilters = {
      searchName: draft.searchName || "",
      poste: draft.poste || "",
      statut: draft.statut || "",
      competences: comps,
      testValide: draft.testValide || "",
      minExperienceMonths: draft.minExperienceMonths || "",
    };

    setFilters(newFilters);
    setFiltersOpen(false);
  };

  const onReset = () => {
    const empty = {
      searchName: "",
      poste: "",
      statut: "",
      competences: [],
      testValide: "",
      minExperienceMonths: "",
    };
    setDraft({ ...empty, competencesInput: "" });
    setFilters(empty);
  };

  const onQuickFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    setDraft({ ...draft, [type]: value });
  };

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/candidats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erreur lors du chargement des candidats");

        const data = await res.json();
        setAllCandidats(data);
      } catch (err) {
        console.error("Erreur fetch candidats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-[#094363] mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#094363] via-[#0a5a7a] to-[#094363] shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <p className="text-blue-100 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                  Gérez et consultez toutes les candidatures reçues
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="px-4 py-2 rounded bg-green-600 text-white hover:opacity-90 transition"
              >
                {filtersOpen ? 'Fermer filtres' : 'Voir les filtres'}
                {hasActiveFilters && (
                  <div className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full ml-2"></div>
                )}
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center min-h-[60px] sm:min-h-[70px] flex flex-col justify-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-blue-100 text-xs sm:text-sm">Total</div>
            </div>
            <div 
              className="bg-green-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center cursor-pointer hover:bg-green-500/30 transition-colors min-h-[60px] sm:min-h-[70px] flex flex-col justify-center"
              onClick={() => onQuickFilter('statut', filters.statut === 'Accepté' ? '' : 'Accepté')}
            >
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-100">{stats.acceptes}</div>
              <div className="text-green-200 text-xs sm:text-sm">Acceptés</div>
            </div>
            <div 
              className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center cursor-pointer hover:bg-yellow-500/30 transition-colors min-h-[60px] sm:min-h-[70px] flex flex-col justify-center col-span-2 sm:col-span-1"
              onClick={() => onQuickFilter('statut', filters.statut === 'En attente' ? '' : 'En attente')}
            >
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-100">{stats.attente}</div>
              <div className="text-yellow-200 text-xs sm:text-sm">En attente</div>
            </div>
            <div 
              className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center cursor-pointer hover:bg-red-500/30 transition-colors min-h-[60px] sm:min-h-[70px] flex flex-col justify-center"
              onClick={() => onQuickFilter('statut', filters.statut === 'Rejeté' ? '' : 'Rejeté')}
            >
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-100">{stats.rejetes}</div>
              <div className="text-red-200 text-xs sm:text-sm">Rejetés</div>
            </div>
            <div 
              className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center cursor-pointer hover:bg-blue-500/30 transition-colors min-h-[60px] sm:min-h-[70px] flex flex-col justify-center"
              onClick={() => onQuickFilter('testValide', filters.testValide === 'oui' ? '' : 'oui')}
            >
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-100">{stats.avecTest}</div>
              <div className="text-blue-200 text-xs sm:text-sm">Avec test</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Filtres avancés */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Filtres avancés</h3>
              {hasActiveFilters && (
                <button
                  onClick={onReset}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Effacer tout
                </button>
              )}
            </div>

            <form onSubmit={onApply} className="space-y-4 sm:space-y-6">
              {/* Grille responsive pour les champs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom ou prénom
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={draft.searchName}
                    onChange={(e) => setDraftField("searchName", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste visé
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Commercial..."
                    value={draft.poste}
                    onChange={(e) => setDraftField("poste", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={draft.statut}
                    onChange={(e) => setDraftField("statut", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="Accepté">Accepté</option>
                    <option value="Rejeté">Rejeté</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Communication, vente..."
                    value={draft.competencesInput}
                    onChange={(e) => setDraftField("competencesInput", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test validé
                  </label>
                  <select
                    value={draft.testValide}
                    onChange={(e) => setDraftField("testValide", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Peu importe</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience min.
                  </label>
                  <input
                    type="number"
                    placeholder="En mois"
                    min="0"
                    value={draft.minExperienceMonths}
                    onChange={(e) => setDraftField("minExperienceMonths", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#094363] focus:ring-4 focus:ring-[#094363]/10 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#094363] to-blue-600 text-white font-medium hover:from-blue-600 hover:to-[#094363] transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Appliquer les filtres
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Barre de résultats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <div className="text-base sm:text-lg font-semibold text-gray-800">
                {candidatsFiltres.length} candidature{candidatsFiltres.length !== 1 ? 's' : ''}
                {hasActiveFilters && (
                  <span className="text-xs sm:text-sm text-gray-500 block sm:inline sm:ml-2">
                    (sur {stats.total} au total)
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {filters.searchName && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="truncate max-w-20 sm:max-w-none">Nom: {filters.searchName}</span>
                      <button 
                        onClick={() => {
                          setFilters(prev => ({ ...prev, searchName: '' }));
                          setDraft(prev => ({ ...prev, searchName: '' }));
                        }}
                        className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.poste && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="truncate max-w-20 sm:max-w-none">Poste: {filters.poste}</span>
                      <button 
                        onClick={() => {
                          setFilters(prev => ({ ...prev, poste: '' }));
                          setDraft(prev => ({ ...prev, poste: '' }));
                        }}
                        className="ml-1 sm:ml-2 text-green-600 hover:text-green-800 flex-shrink-0"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.statut && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <span className="truncate max-w-20 sm:max-w-none">Statut: {filters.statut}</span>
                      <button 
                        onClick={() => {
                          setFilters(prev => ({ ...prev, statut: '' }));
                          setDraft(prev => ({ ...prev, statut: '' }));
                        }}
                        className="ml-1 sm:ml-2 text-purple-600 hover:text-purple-800 flex-shrink-0"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {candidatsFiltres.length === 0 && hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#094363] hover:bg-blue-50 rounded-lg transition-colors duration-200 self-start sm:self-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        </div>

        {/* Résultats */}
        {candidatsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {hasActiveFilters ? 'Aucun candidat trouvé' : 'Aucune candidature'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
              {hasActiveFilters 
                ? 'Essayez de modifier vos filtres pour élargir la recherche.'
                : 'Il n\'y a pas encore de candidatures enregistrées.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#094363] text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Voir toutes les candidatures</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {candidatsFiltres.map((candidat) => (
              <CandidatureCard key={candidat._id} candidat={candidat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}