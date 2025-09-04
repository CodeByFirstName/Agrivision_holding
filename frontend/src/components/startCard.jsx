import { FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";

export default function StatCard({ label, value, hint, type }) {
  // Définir l’icône et la couleur selon le type
  let icon, color;
  switch (type) {
    case "candidatures":
      icon = <FiUsers size={24} />;
      color = "text-[#094363]"; // 🔹 icône en bleu charte
      break;
    case "offres":
      icon = <FiBriefcase size={24} />;
      color = "text-[#094363]"; // 🔹 icône en bleu charte
      break;
    case "tests":
      icon = <FiCheckCircle size={24} />;
      color = "text-[#026530]"; // vert charte
      break;
    default:
      icon = <FiCheckCircle size={24} />;
      color = "text-gray-700";
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-4 sm:p-5 flex items-center gap-4 hover:shadow-md transition">
      {/* Icône */}
      <div className={`p-2 text-2xl ${color}`}>{icon}</div>

      {/* Texte */}
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-900">{label}</div> {/* 🔹 titre en noir bold */}
        <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
        {hint && <div className="mt-2 text-xs text-gray-500">{hint}</div>}
      </div>
    </div>
  );
}
