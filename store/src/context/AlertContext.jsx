import React, { createContext, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
  });

  const showAlert = (message) => {
    setAlert({ show: true, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, message: "" });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      <AlertModal />
    </AlertContext.Provider>
  );

  function AlertModal() {
    return (
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-md"
            onClick={hideAlert}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4 border border-gray-300 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-gray-800 text-lg mb-4">{alert.message}</p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded cursor-pointer"
                  onClick={hideAlert}
                >
                  Aceptar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
