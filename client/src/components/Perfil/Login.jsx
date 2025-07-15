import { useState } from "react";
import { loginUsuario } from "../../services/usuarioService";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

import { motion } from "framer-motion";

function Login({ setIsSigningUp, setIsLoggedIn }) {
  const [form, setForm] = useState({});
  const { refreshAuth } = useAuth();
  const { showAlert } = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUsuario(form)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        refreshAuth();
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        showAlert(
          error.response?.data?.message || "Error al iniciar sesión"
        );
      });
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-8 rounded-lg w-full max-w-md"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email:
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña:
            </label>
            <motion.input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-[var(--color-secondary)] text-white py-2 rounded cursor-pointer transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Iniciar Sesión
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <motion.button
            onClick={() => setIsSigningUp(true)}
            className="text-blue-600 hover:underline"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            whileHover={{ scale: 1.05 }}
          >
            Regístrate acá
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;
