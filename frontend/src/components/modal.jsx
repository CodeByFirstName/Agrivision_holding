import ReactDOM from 'react-dom';
import { useModal } from '../contexts/modalContext';
import SignUpForm from './signUpForm';
import LoginForm from './loginForm';

export default function Modal() {
  const { showModal, authMode, closeModal, setAuthMode } = useModal();

  if (!showModal) return null;

  const renderForm = () => {
    return authMode === 'signup' ? (
      <SignUpForm switchToLogin={() => setAuthMode('login')} onClose={closeModal} />
    ) : (
      <LoginForm switchToSignup={() => setAuthMode('signup')} onClose={closeModal} />
    );
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-3xl mx-4">
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-gray-500 text-2xl font-bold hover:text-gray-700"
        >
          &times;
        </button>
        {renderForm()}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}



