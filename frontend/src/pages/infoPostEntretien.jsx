
import React, { useState, useRef, useContext } from "react";
import SignatureCanvas from "react-signature-canvas";
import { AuthContext } from "../contexts/authContext";

export default function InfoPostEntretien() {
  const { user, token, logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenoms: user?.prenoms || "",
    email: user?.email || "",
    telephone: "",
    adresse: "",
    photoFile: null,
    photoPreview: "",
    signature: "",
    consentement: false,
    contactsUrgence: [],
    references: [],
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const sigPadRef = useRef();

  // 🔹 Champs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelephoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setFormData((prev) => ({ ...prev, telephone: value }));
  };

  // 🔹 Contacts d'urgence
  const addContactUrgence = () =>
    setFormData((prev) => ({
      ...prev,
      contactsUrgence: [...prev.contactsUrgence, { nom: "", prenom: "", relation: "", telephone: "" }],
    }));

  const removeContactUrgence = (index) =>
    setFormData((prev) => ({
      ...prev,
      contactsUrgence: prev.contactsUrgence.filter((_, i) => i !== index),
    }));

  const handleContactUrgenceChange = (index, field, value) => {
    const updated = [...formData.contactsUrgence];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, contactsUrgence: updated }));
  };

  // 🔹 Références
  const addReference = () =>
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { nom: "", poste: "", contact: "" }],
    }));

  const removeReference = (index) =>
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));

  const handleReferenceChange = (index, field, value) => {
    const updated = [...formData.references];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, references: updated }));
  };

  // 🔹 Consentement
  const handleConsent = () =>
    setFormData((prev) => ({ ...prev, consentement: !prev.consentement }));

  // 🔹 Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  // 🔹 Signature
  const clearSignature = () => {
    sigPadRef.current.clear();
    setFormData((prev) => ({ ...prev, signature: "" }));
  };

  const saveSignature = () => {
    if (sigPadRef.current.isEmpty()) return;
    const dataURL = sigPadRef.current.toDataURL();
    setFormData((prev) => ({ ...prev, signature: dataURL }));
  };

  // 🔹 Popup de succès avec déconnexion directe
  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    logout();
  };

  // 🔹 Soumission
  const handleSubmit = async () => {
    try {
      if (!user) {
        alert("Utilisateur non identifié !");
        return;
      }

      // 🔹 Sauvegarde de la signature avant envoi
      saveSignature();

      setLoading(true);

      const form = new FormData();
      form.append("userId", user._id || user.id);
      form.append("telephone", formData.telephone || "");
      form.append("adresse", formData.adresse || "");
      form.append("consentement", formData.consentement);
      form.append("contactsUrgence", JSON.stringify(formData.contactsUrgence || []));
      form.append("references", JSON.stringify(formData.references || []));

      // Photo
      if (formData.photoFile) {
        form.append("photo", formData.photoFile);
      }

      // Signature
      if (formData.signature) {
        const blob = await (await fetch(formData.signature)).blob();
        form.append("signature", blob, "signature.png");
      }

      const res = await fetch("http://localhost:5000/api/info-post-entretien/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Erreur serveur");
      }

      const data = await res.json();
      console.log("Retour backend :", data);

      setShowSuccessPopup(true);

    } catch (err) {
      console.error("Erreur handleSubmit :", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#094363] mb-2">Informations Complémentaires</h1>
          <p className="text-gray-600">Dernière étape de votre candidature</p>
        </div>

        {/* Infos personnelles */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#094363] mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input value={formData.nom} disabled className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénoms</label>
              <input value={formData.prenoms} disabled className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={formData.email} disabled className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-[#094363] text-white border border-[#094363] rounded-l-md">+229</span>
                <input value={formData.telephone} onChange={handleTelephoneChange} placeholder="Téléphone" className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:border-[#094363]"/>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input value={formData.adresse} name="adresse" onChange={handleChange} placeholder="Votre adresse complète" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
            </div>
          </div>
        </div>

        {/* Contacts d'urgence */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-[#094363]">Contacts d'urgence</h2>
            <button onClick={addContactUrgence} className="px-4 py-2 bg-[#16a34a] text-white rounded-md hover:bg-green-700 text-sm">+ Ajouter</button>
          </div>
          
          {formData.contactsUrgence.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun contact d'urgence ajouté</p>
          ) : (
            <div className="space-y-4">
              {formData.contactsUrgence.map((c, i) => (
                <div key={i} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input value={c.nom} onChange={(e) => handleContactUrgenceChange(i, "nom", e.target.value)} placeholder="Nom" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                    <input value={c.prenom} onChange={(e) => handleContactUrgenceChange(i, "prenom", e.target.value)} placeholder="Prénom" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                    <input value={c.relation} onChange={(e) => handleContactUrgenceChange(i, "relation", e.target.value)} placeholder="Relation" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                    <div className="flex gap-2">
                      <input value={c.telephone} onChange={(e) => handleContactUrgenceChange(i, "telephone", e.target.value)} placeholder="Téléphone" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                      <button onClick={() => removeContactUrgence(i)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Références */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-[#094363]">Références professionnelles</h2>
            <button onClick={addReference} className="px-4 py-2 bg-[#16a34a] text-white rounded-md hover:bg-green-700 text-sm">+ Ajouter</button>
          </div>
          
          {formData.references.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune référence ajoutée</p>
          ) : (
            <div className="space-y-4">
              {formData.references.map((r, i) => (
                <div key={i} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input value={r.nom} onChange={(e) => handleReferenceChange(i, "nom", e.target.value)} placeholder="Nom complet" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                    <input value={r.poste} onChange={(e) => handleReferenceChange(i, "poste", e.target.value)} placeholder="Poste" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                    <div className="flex gap-2">
                      <input value={r.contact} onChange={(e) => handleReferenceChange(i, "contact", e.target.value)} placeholder="Contact" className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#094363]"/>
                      <button onClick={() => removeReference(i)} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo et Signature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Photo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#094363] mb-4">Photo d'identité</h2>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full p-2 border border-gray-300 rounded-md mb-3"/>
            {formData.photoPreview && (
              <div className="flex justify-center">
                <img src={formData.photoPreview} alt="Aperçu" className="w-24 h-24 object-cover rounded-md border"/>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#094363] mb-4">Signature électronique</h2>
            <div className="border border-gray-300 rounded-md mb-3">
              <SignatureCanvas ref={sigPadRef} penColor="black" canvasProps={{ width: 300, height: 120, className: "w-full h-auto" }}/>
            </div>
            <button onClick={clearSignature} className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">Effacer</button>
          </div>
        </div>

        {/* Consentement et Soumission */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3 mb-6">
            <input type="checkbox" checked={formData.consentement} onChange={handleConsent} className="mt-1 w-4 h-4 text-[#094363] border-gray-300 rounded"/>
            <div>
              <p className="text-sm text-gray-700">
                Je consens à l'utilisation de mes informations personnelles dans le cadre de ma candidature.
              </p>
            </div>
          </div>
          
          <button onClick={handleSubmit} disabled={loading || !formData.consentement} className={`w-full py-3 px-4 font-medium rounded-md transition-colors ${loading || !formData.consentement ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#094363] text-white hover:bg-blue-700"}`}>
            {loading ? "Enregistrement..." : "Finaliser ma candidature"}
          </button>
        </div>
      </div>

      {/* Popup de succès */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold text-[#094363] mb-3">Candidature finalisée !</h3>
            <p className="text-gray-600 mb-4 text-sm">Votre candidature a été soumise avec succès. Vous recevrez une confirmation par email.</p>
            <button onClick={handleSuccessClose} className="w-full py-2 px-4 bg-[#094363] text-white rounded-md hover:bg-blue-700">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
