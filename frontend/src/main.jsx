// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ModalProvider } from './contexts/modalContext';
import { AuthProvider } from "./contexts/authContext";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <ModalProvider>
        <App />
     </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
