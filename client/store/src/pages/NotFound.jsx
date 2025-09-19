import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "@/context/AlertContext";

function NotFound() {
  const { showAlert } = useAlert();

  useEffect(() => {
    showAlert("Página no encontrada", "error");
  }, [showAlert]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold text-error">404</h1>
          <h2 className="text-3xl font-bold mt-4">Página no encontrada</h2>
          <p className="py-6 text-base-content/80">
            Lo sentimos, no pudimos encontrar la página que buscabas.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
