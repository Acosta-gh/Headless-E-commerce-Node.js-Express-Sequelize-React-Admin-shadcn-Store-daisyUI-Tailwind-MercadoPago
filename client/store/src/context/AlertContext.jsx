import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);

  const showAlert = useCallback((message, type = "info") => {
    console.debug("[AlertContext] showAlert called:", { message, type });
    setAlert({ message, type });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.debug("[AlertContext] auto-dismiss alert");
      setAlert(null);
      timeoutRef.current = null;
    }, 3000);
  }, []);

  const closeAlert = useCallback(() => {
    console.debug("[AlertContext] closeAlert called");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAlert(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const value = useMemo(() => ({ alert, showAlert, closeAlert }), [alert, showAlert, closeAlert]);

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlert() {
  return useContext(AlertContext);
}