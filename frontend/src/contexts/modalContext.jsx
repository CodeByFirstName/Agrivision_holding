// src/contexts/modalContext.jsx
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'signup'

  // nouveau : email pré-rempli pour le login
  const [prefillEmail, setPrefillEmail] = useState("");

  const openLoginModal = () => {
    setAuthMode('login');
    setShowModal(true);
  };

  const openSignupModal = () => {
    setAuthMode('signup');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        authMode,
        openLoginModal,
        openSignupModal,
        closeModal,
        setAuthMode,
        prefillEmail,      // expose
        setPrefillEmail,   // expose
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Hook personnalisé pour consommer facilement le contexte
export const useModal = () => useContext(ModalContext);
