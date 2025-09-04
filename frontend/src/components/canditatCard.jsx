import { useNavigate } from "react-router-dom";

export default function CandidatureCard({ candidat }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#094363]/20 rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
      {/* Nom */}
      <h2 className="text-xl font-bold text-[#094363] mb-2">
        {candidat.user?.prenoms} {candidat.user?.nom}
      </h2>

      {/* Poste visé */}
      <p className="text-sm text-gray-700 mb-1">
        <span className="font-semibold">Poste visé :</span>{" "}
        {candidat.offre?.titre || "Non défini"}
      </p>

      {/* Expériences */}
      <p className="text-sm text-gray-700 mb-1">
        <span className="font-semibold">Expérience :</span>{" "}
        {candidat.experiences?.length
          ? candidat.experiences.map((e) => `${e.duree} mois`).join(", ")
          : "Non renseignée"}
      </p>

      {/* Compétences */}
      {candidat.competences?.length > 0 && (
        <div className="flex flex-wrap gap-2 my-2">
          {candidat.competences.map((comp, idx) => (
            <span
              key={idx}
              className="text-xs bg-[#094363]/10 text-[#094363] px-2 py-1 rounded-full"
            >
              {comp}
            </span>
          ))}
        </div>
      )}

      {/* Statut */}
      <span
        className={`inline-block w-fit px-3 py-1 text-xs font-medium rounded-full mb-3 ${
          candidat.statut === "Accepté"
            ? "bg-green-100 text-green-700"
            : candidat.statut === "Rejeté"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {candidat.statut || "En attente"}
      </span>

      {/* Bouton */}
      <button
        onClick={() => navigate(`/candidatures/${candidat._id}`)}
        className="w-full px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:opacity-90 transition"
      >
        Voir profil
      </button>
    </div>
  );
}
