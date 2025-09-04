import React, { useEffect } from 'react';

export default function Popup({ message, type = 'info', onClose, duration = 5000 }) {
  // Configuration des couleurs selon le type
  const typeConfig = {
    success: { 
      bg: 'bg-gradient-to-r from-green-500 to-green-600', 
      border: 'border-green-400',
      shadow: 'shadow-green-500/25'
    },
    error: { 
      bg: 'bg-gradient-to-r from-red-500 to-red-600', 
      border: 'border-red-400',
      shadow: 'shadow-red-500/25'
    },
    info: { 
      bg: 'bg-gradient-to-r from-[#16a34a] to-[#18b34f]', 
      border: 'border-[#16a34a]',
      shadow: 'shadow-[#16a34a]/25'
    },
  };

  const { bg, border, shadow } = typeConfig[type] || typeConfig.info;

  // Fermeture automatique
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    // Overlay centré sur tout l'écran
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto animate-slideDown">
        <div className={`
          ${bg} ${border} ${shadow}
          text-white px-6 py-4 rounded-2xl shadow-2xl
          border backdrop-blur-sm
          min-w-[320px] max-w-md mx-4
          transform transition-all duration-300 ease-out
        `}>
          <div className="flex items-center justify-between">
            <p className="text-white font-medium text-sm pr-4">
              {message}
            </p>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 text-lg leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white/60 h-1 rounded-full animate-shrink"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        
        .animate-shrink {
          width: 100%;
        }
      `}</style>
    </div>
  );
}