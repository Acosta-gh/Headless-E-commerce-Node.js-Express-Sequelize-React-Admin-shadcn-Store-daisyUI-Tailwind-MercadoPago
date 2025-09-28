import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { Link } from "react-router-dom";
import VerifyModal from "@/components/auth/VerifyModal";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Legal checkboxes states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false); // Opcional

  const { showAlert } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!termsAccepted) {
      setError("Debes aceptar los Términos y Condiciones para registrarte");
      return;
    }

    setLoading(true);
    try {
      // TODO: Incluir marketingAccepted en el payload 
      await register(form);
      setUserEmail(form.email);
      setIsModalOpen(true);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error desconocido al registrar usuario";

      setError(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center w-full justify-center bg-base-200">
      <div className="card w-full max-w-xl shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Registrarse</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Tu email (Ej: tu@email.com)"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Tu dirección (Ej: Calle 123)"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="(Opcional)"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmar Contraseña</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="input input-bordered w-full"
              />
            </div>

            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend">Legal</legend>
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="label-text ml-2">
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="link link-primary"
                    target="_blank"
                  >
                    Términos y Condiciones
                  </Link>
                </span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                />
                <span className="label-text ml-2">
                  Acepto que mis datos sean usados para enviarme novedades y
                  promociones
                </span>
              </label>
            </fieldset>

            <button
              type="submit"
              className={`btn btn-primary mx-auto block  ${
                loading ? "loading loading-dots loading-xs" : ""
              }`}
              disabled={loading}
            >
              Registrarse
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
      <VerifyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={userEmail}
      />
    </div>
  );
}
