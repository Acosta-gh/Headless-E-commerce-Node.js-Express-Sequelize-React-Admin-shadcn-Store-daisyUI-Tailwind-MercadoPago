import { useState } from "react";
import { createUsuario } from "../../services/usuarioService";
import { motion } from "framer-motion";
import { useAlert } from "../../context/AlertContext";

function SignUp({ setIsSigningUp, setIsLoggedIn }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await createUsuario(form); // Asegúrate que este hit sea a /api/usuario/register
      console.log("Usuario creado:", response.data || response);
      // El backend NO manda token ahora
      showAlert(
        (response.data?.message || "Usuario creado. Revisa tu email para confirmar la cuenta."),
        "success"
      );
      // Cambiar a pantalla de login para que luego pueda iniciar sesión tras verificar
      setTimeout(() => {
        setIsSigningUp(false);
      }, 2500);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      if (error.response) {
        showAlert(error.response.data?.message || "Error al crear usuario", "error");
      } else if (error.request) {
        showAlert("No se pudo conectar con el servidor", "error");
      } else {
        showAlert(error.message || "Error desconocido al crear usuario", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-8 rounded-lg w-full max-w-md bg-white/70 backdrop-blur"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registrate</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 mb-2">
              Nombre:
            </label>
            <motion.input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              whileFocus={{ scale: 1.01 }}
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-gray-700 mb-2">
              Teléfono:
            </label>
            <motion.input
              type="text"
              id="telefono"
              name="telefono"
              required
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              whileFocus={{ scale: 1.01 }}
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email:
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              whileFocus={{ scale: 1.01 }}
              disabled={loading}
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
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              whileFocus={{ scale: 1.01 }}
              disabled={loading}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white py-2 rounded cursor-pointer font-medium disabled:opacity-60 transition-colors"
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? "Enviando..." : "Registrarse"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tenés una cuenta?{" "}
          <motion.button
            type="button"
            onClick={() => setIsSigningUp(false)}
            className="text-blue-600 hover:underline"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            whileHover={{ scale: 1.05 }}
            disabled={loading}
          >
            Inicia sesión
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;