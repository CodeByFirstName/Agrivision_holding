// src/contexts/authContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext();
export { AuthContext };
export const useAuth = () => useContext(AuthContext);

// Fonction utilitaire pour vérifier si le token est valide
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Vérification du token au montage du composant
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !isTokenValid(storedToken)) {
      // Token expiré, on déconnecte automatiquement
      console.log("Token expiré détecté, déconnexion automatique");
      logout();
    }
  }, []);

  const login = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Helper fetch avec Bearer automatiquement
  const authFetch = useMemo(() => {
    return async (url, options = {}) => {
      // Vérifier la validité du token avant l'appel
      if (token && !isTokenValid(token)) {
        console.log("Token expiré détecté lors d'un appel API");
        logout();
        throw new Error("Token expiré");
      }

      const finalOpts = {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": options.body instanceof FormData ? undefined : "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
      
      const res = await fetch(url, finalOpts);
      
      // Si 401 => on déconnecte
      if (res.status === 401) {
        console.log("Erreur 401 reçue, déconnexion");
        logout();
      }
      
      return res;
    };
  }, [token]);

  // Permet de mettre à jour mustChangePassword après succès
  const markPasswordChanged = () => {
    if (!user) return;
    const updated = { ...user, mustChangePassword: false };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    // Vérification plus robuste de l'authentification
    isAuthenticated: !!token && isTokenValid(token),
    login,
    logout,
    authFetch,
    markPasswordChanged,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};