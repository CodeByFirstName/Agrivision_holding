import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Award, FileText, CheckCircle, Users, Calendar, Download } from "lucide-react";

export default function CandidatureDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const [c, setC] = useState(null);
  const [postEntretien, setPostEntretien] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!token) return;

  const fetchData = async () => {
    setLoading(true);

    try {
      // 🔹 1️⃣ Récupérer la candidature
      const resC = await fetch(`http://localhost:5000/api/candidats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resC.ok) throw new Error("Candidature introuvable");
      const dataC = await resC.json();
      setC(dataC);

      const userId = dataC?.user?._id;

      if (userId) {
        // 🔹 2️⃣ Récupérer les infos post-entretien
        try {
          const resPost = await fetch(
            `http://localhost:5000/api/info-post-entretien/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resPost.ok) {
            const dataPost = await resPost.json();
            setPostEntretien(dataPost);
          } else if (resPost.status === 404) {
            setPostEntretien(null);
          } else {
            console.error("Erreur fetch post-entretien:", resPost.statusText);
          }
        } catch (err) {
          console.error("Erreur fetch post-entretien:", err);
          setPostEntretien(null);
        }

        // 🔹 3️⃣ Récupérer les résultats de tests
        try {
          const resTest = await fetch(
            `http://localhost:5000/api/testResults/by-candidat/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resTest.ok) {
            const dataTest = await resTest.json();
            setTestResults(Array.isArray(dataTest) ? dataTest : [dataTest]);
          } else if (resTest.status === 404) {
            setTestResults([]);
          } else {
            console.error("Erreur fetch testResults:", resTest.statusText);
            setTestResults([]);
          }
        } catch (err) {
          console.error("Erreur fetch testResults:", err);
          setTestResults([]);
        }
      }
    } catch (err) {
      console.error("Erreur fetch candidature:", err);
      setC(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, token]);


  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#094363] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Candidature introuvable</h2>
          <p className="text-gray-600 mb-4">Cette candidature n'existe pas ou a été supprimée</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#094363] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const prenom = c.user?.prenom || c.user?.prenoms || "";
  const nom = c.user?.nom || "";

  const getStatutColor = (statut) => {
    const colors = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Accepté': 'bg-green-100 text-green-800',
      'Rejeté': 'bg-red-100 text-red-800',
      'En cours': 'bg-blue-100 text-blue-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 font-medium">Retour</span>
        </button>

        {/* Header - Informations de base */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#094363] to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#094363]">
                {prenom} {nom}
              </h1>
              <p className="text-gray-600 text-lg">Profil candidat</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-[#094363]" />
              <div>
                <p className="font-bold text-gray-800">Email</p>
                <p className="text-gray-700">{c.user?.email || "Non renseigné"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#094363]" />
              <div>
                <p className="font-bold text-gray-800">Téléphone</p>
                <p className="text-gray-700">{c.telephone || "Non renseigné"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-1">
              <MapPin className="w-5 h-5 text-[#094363]" />
              <div>
                <p className="font-bold text-gray-800">Adresse</p>
                <p className="text-gray-700">{c.adresse || "Non renseignée"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Compétences */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-6 h-6 text-[#094363]" />
                <h2 className="text-xl font-semibold text-[#094363]">Compétences</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {c.competences?.length > 0 ? (
                  c.competences.map((comp, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-blue-50 text-[#094363] rounded-full font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {comp}
                    </span>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">Aucune compétence renseignée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expériences */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <Briefcase className="w-6 h-6 text-[#094363]" />
                <h2 className="text-xl font-semibold text-[#094363]">Expériences professionnelles</h2>
              </div>
              
              <div className="space-y-4">
                {c.experiences?.length > 0 ? (
                  c.experiences.map((exp, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Poste occupé</p>
                          <p className="text-gray-900">{exp.poste || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Entreprise</p>
                          <p className="text-gray-900">{exp.societe || exp.entreprise || "Non renseignée"}</p>
                        </div>
                      </div>
                      
                      {exp.duree && (
                        <div className="mb-4">
                          <p className="font-bold text-gray-800 mb-1">Durée</p>
                          <p className="text-gray-700">{exp.duree} mois</p>
                        </div>
                      )}
                      
                      {exp.description && (
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Description</p>
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">Aucune expérience professionnelle</p>
                    <p className="text-gray-400">Le candidat n'a pas encore ajouté d'expérience</p>
                  </div>
                )}
              </div>
            </div>

            {/* Résultats des tests */}
            {testResults?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-[#094363]" />
                  <h2 className="text-xl font-semibold text-[#094363]">Résultats des tests</h2>
                </div>
                
                <div className="space-y-4">
                  {testResults.map((result, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-white">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Test</p>
                          <p className="text-gray-900">{result.test?.titre || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Score</p>
                          <p className="text-2xl font-bold text-[#094363]">{result.score || "—"}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Statut</p>
                          <span className={`px-3 py-1 rounded-full font-medium ${getStatutColor(result.status)}`}>
                            {result.status || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* CV */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-[#094363]" />
                <h2 className="text-xl font-semibold text-[#094363]">CV</h2>
              </div>
              
              {c.cvUrl ? (
                <a
                  href={c.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${prenom}_${nom}_CV.pdf`}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-[#094363] to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Télécharger le CV</span>
                  <Download className="w-4 h-4" />
                </a>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun CV transmis</p>
                </div>
              )}
            </div>

            {/* Informations post-entretien */}
            {postEntretien && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-[#094363]" />
                  <h2 className="text-xl font-semibold text-[#094363]">Informations post-entretien</h2>
                </div>

                <div className="space-y-6">
                  
                  {/* Photo */}
                  {postEntretien.photo && (
                    <div>
                      <p className="font-bold text-gray-800 mb-2">Photo d'identité</p>
                      <div className="relative">
                        <img
                          src={postEntretien.photo}
                          alt="Photo candidat"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                        <button
                          onClick={() => downloadImage(postEntretien.photo, `${prenom}_${nom}_Photo.jpg`)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-[#094363] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                          title="Télécharger la photo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Signature */}
                  {postEntretien.signature && (
                    <div>
                      <p className="font-bold text-gray-800 mb-2">Signature électronique</p>
                      <div className="relative">
                        <img
                          src={postEntretien.signature}
                          alt="Signature"
                          className="w-full max-w-[200px] h-20 object-contain border-2 border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                        />
                        <button
                          onClick={() => downloadImage(postEntretien.signature, `${prenom}_${nom}_Signature.jpg`)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-[#094363] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                          title="Télécharger la signature"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Adresse complète */}
                  {postEntretien.adresse && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-bold text-gray-800 mb-1">Adresse complète</p>
                      <p className="text-gray-900">{postEntretien.adresse}</p>
                    </div>
                  )}

                  {/* Consentement */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-800 mb-2">Consentement données</p>
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      postEntretien.consentement 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {postEntretien.consentement ? "Accepté" : "Refusé"}
                    </span>
                  </div>

                  {/* Date de soumission */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-800 mb-2">Date de soumission</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#094363]" />
                      <p className="text-gray-900">
                        {new Date(postEntretien.dateSoumission).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* Contacts d'urgence */}
                  {postEntretien.contactsUrgence?.length > 0 && (
                    <div>
                      <p className="font-bold text-gray-800 mb-3">Contacts d'urgence</p>
                      <div className="space-y-3">
                        {postEntretien.contactsUrgence.map((contact, i) => (
                          <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                            <p className="font-bold text-gray-900 mb-1">
                              {contact.prenom} {contact.nom}
                            </p>
                            <p className="text-gray-700"><span className="font-bold">Relation:</span> {contact.relation}</p>
                            <p className="text-gray-700"><span className="font-bold">Téléphone:</span> {contact.telephone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Références */}
                  {postEntretien.references?.length > 0 && (
                    <div>
                      <p className="font-bold text-gray-800 mb-3">Références professionnelles</p>
                      <div className="space-y-3">
                        {postEntretien.references.map((ref, i) => (
                          <div key={i} className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
                            <p className="font-bold text-gray-900 mb-1">{ref.nom}</p>
                            <p className="text-gray-700"><span className="font-bold">Poste:</span> {ref.poste}</p>
                            <p className="text-gray-700"><span className="font-bold">Contact:</span> {ref.contact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}