import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiBriefcase, FiCheckSquare, FiX } from "react-icons/fi";

const nav = [
  { to: "/admin", label: "Dashboard", icon: <FiHome />, end: true },
  { to: "/admin/candidatures", label: "Candidatures", icon: <FiUsers /> },
  { to: "/admin/offres", label: "Offres d’emploi", icon: <FiBriefcase /> },
  { to: "/admin/tests", label: "Tests", icon: <FiCheckSquare /> },
];

export default function Sidebar({ isOpen, setIsOpen, onNavigate }) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header logo + croix */}
        <div className="px-4 py-5 border-b flex justify-between items-center">
          <img src="/logo.png" alt="Agrivision" className="h-14 w-auto" />
          <button
            className="md:hidden text-gray-600 hover:text-black"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => {
                onNavigate?.();
                setIsOpen(false); // ferme la sidebar sur mobile
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200
                 ${
                   isActive
                     ? "bg-[#094363] text-white"
                     : "hover:bg-gray-100 text-gray-700"
                 }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
