import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PopupMessage({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className={`flex flex-col items-center rounded-xl shadow-lg px-8 py-6 w-full max-w-[400px] mx-4 ${
            isSuccess ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          {/* Icône */}
          {isSuccess ? (
            <FaCheckCircle className="h-14 w-14 text-green-500 mb-3" />
          ) : (
            <FaTimesCircle className="h-14 w-14 text-red-500 mb-3" />
          )}

          {/* Message */}
          <p
            className={`text-center text-lg font-medium ${
              isSuccess ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
