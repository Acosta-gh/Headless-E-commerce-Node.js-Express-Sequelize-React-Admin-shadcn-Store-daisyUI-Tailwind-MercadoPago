import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
export default function LoginModal({ open, onClose }) {
  const { login, isLoading, user } = useAuth();

  const [form, setForm] = React.useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(form);
      setForm({ email: "", password: "" });
      onClose();
    } catch (error) {
      // El error ya se muestra por AlertContext
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-100 rounded-lg p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input input-bordered w-full mb-4"
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            name="email"
            required
          />
          <input
            className="input input-bordered w-full mb-4"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            name="password"
            required
          />
          <button className="btn btn-primary w-full mb-2" type="submit">
            Entrar
          </button>
          {/* 
          <button
            className="btn btn-ghost w-full"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
          */}
          <Link to="/" className="btn btn-ghost w-full">
            Volver
          </Link>
          <Link to="/register">
            <p className="text-sm text-center mt-4">
              ¿No tienes cuenta? Regístrate
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
}
