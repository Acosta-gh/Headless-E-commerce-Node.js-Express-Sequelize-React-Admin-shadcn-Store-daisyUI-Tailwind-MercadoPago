import React from "react";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

function VerifyModal({ open, onClose, userEmail = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-lg p-6 shadow-lg w-full max-w-sm relative">
        {/* Botón de cierre arriba a la derecha */}
        <button
          className="btn btn-sm btn-circle absolute top-2 right-2"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <MailCheck className="w-10 h-10 text-primary mb-4" />

          <h2 className="text-2xl font-bold mb-2">¡Revisa tu email!</h2>

          <p className="mb-4">
            Hemos enviado un correo a <br />
            <span className="font-semibold">{userEmail}</span>
            <br />
            con un enlace para verificar tu cuenta.
          </p>

          <p className="text-xs text-gray-500 mb-4">
            Si no lo encuentras, revisa tu carpeta de spam o promociones.
          </p>

          <Link className="btn btn-primary btn-block" to="/profile" onClick={onClose}>
            Entendido
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyModal;
