import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useModal } from "../contexts/modalContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { openSignupModal } = useModal();
   
  const handleConnexionClick = () => {
    openSignupModal();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo optimisé */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Agrivision Holding"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8 text-black font-bold text-base font-metropolis">
          <a href="#" className="relative hover:text-[#094363] transition-colors group">
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-full"></span>
          </a>
          <a href="#offres" className="relative hover:text-[#094363] transition-colors group">
            Offres d'emploi
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-full"></span>
          </a>
          <a href="#apropos" className="relative hover:text-[#094363] transition-colors group">
            À propos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-full"></span>
          </a>

          {/* Bouton Connexion → ouvre modal */}
          <button
            onClick={handleConnexionClick}
            className="relative hover:text-[#094363] transition-colors group"
          >
            Inscription
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-full"></span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-black" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white border-t border-gray-100">
          <nav className="flex flex-col space-y-2 text-black font-bold">
            <a href="#" className="px-3 py-2 rounded-md hover:text-[#094363] hover:bg-gray-100 transition-colors relative group">
              Accueil
              <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-[calc(100%-1.5rem)]"></span>
            </a>
            <a href="#offres" className="px-3 py-2 rounded-md hover:text-[#094363] hover:bg-gray-100 transition-colors relative group">
              Offres d'emploi
              <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-[calc(100%-1.5rem)]"></span>
            </a>
            <a href="#apropos" className="px-3 py-2 rounded-md hover:text-[#094363] hover:bg-gray-100 transition-colors relative group">
              À propos
              <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-[calc(100%-1.5rem)]"></span>
            </a>

            {/* Mobile version du bouton Connexion */}
            <button
              onClick={handleConnexionClick}
              className="px-3 py-2 rounded-md text-left hover:text-[#094363] hover:bg-gray-100 transition-colors relative group"
            >
              Inscription
              <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-[#094363] transition-all group-hover:w-[calc(100%-1.5rem)]"></span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}