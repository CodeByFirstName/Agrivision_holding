import { FiBell, FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function Header({ title, subtitle, onMenuClick, isDashboard = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Supprime le token et l'utilisateur du localStorage
    navigate("/");      // Redirige vers la page d'accueil
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="h-16 px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Ouvrir le menu"
          >
            <FiMenu className="text-lg sm:text-xl" style={{ color: "#094363" }} />
          </button>
          <div className="truncate min-w-0">
            {!isDashboard && (
              <h1 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                {title}
              </h1>
            )}
            {isDashboard && (
              <p className="text-sm sm:text-base md:text-xl font-semibold text-gray-700 truncate">
                Bienvenue cher Admin
              </p>
            )}
            {!isDashboard && subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button className="p-1 sm:p-2 rounded hover:bg-gray-100" aria-label="Notifications">
            <FiBell className="text-base sm:text-lg" style={{ color: "#026530" }} />
          </button>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className="p-1 sm:p-2 rounded bg-gray-900 text-white hover:opacity-90"
            aria-label="Se déconnecter"
          >
            <FiLogOut className="text-base sm:text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}
