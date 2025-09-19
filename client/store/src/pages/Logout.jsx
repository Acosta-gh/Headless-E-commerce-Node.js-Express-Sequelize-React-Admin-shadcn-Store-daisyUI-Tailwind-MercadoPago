import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Logout() {
  const { logout } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      setDone(true);
    }, 1000 );
    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl p-8 w-full max-w-md text-center">
        {!done ? (
          <>
            <div className="flex justify-center mb-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-primary">Cerrando sesión...</h1>
            <p className="text-base-content mb-4">Por favor espera un momento.</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-success" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-success">¡Sesión cerrada!</h1>
            <p className="mb-4">Has salido correctamente.</p>
            <a href="/" className="btn btn-primary">Ir al inicio</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Logout;