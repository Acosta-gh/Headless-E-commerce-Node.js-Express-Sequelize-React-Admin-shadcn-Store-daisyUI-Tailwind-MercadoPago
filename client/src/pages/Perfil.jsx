import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Loading from "../components/Ui/Loading.jsx";
import Login from "../components/Perfil/Login.jsx";
import SignUp from "../components/Perfil/SignUp.jsx";
import { getPedidosByUsuario } from "../services/pedidoService.js";
import PedidosAdmin from "../components/Admin/PedidosAdmin.jsx";
import ReactPaginate from "react-paginate";
import { updateUsuario, getUsuarioById } from "../services/usuarioService.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  SquarePen,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ShoppingBag,
  ChevronRight,
  User,
  ShieldCheck,
} from "lucide-react";

// Animation variants
const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const listItemAnimation = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
};

const buttonHover = {
  scale: 1.03,
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
  transition: { duration: 0.2 },
};

const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

// Function to get user data from sessionStorage
const getUserDataFromSession = () => {
  const userData = sessionStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

function Perfil() {
  const { token, isAdmin, isRepartidor, refreshAuth } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedInfo, setDecodedInfo] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false); // New state to ensure content is ready

  // Initialize state directly from sessionStorage
  const sessionData = getUserDataFromSession();

  // estados para editar perfil - initialize with sessionStorage data if available
  const [telefono, setTelefono] = useState(sessionData?.telefono || "");
  const [direccion, setDireccion] = useState(sessionData?.direccion || "");
  const [email, setEmail] = useState(sessionData?.email || "");
  const [nombre, setNombre] = useState(sessionData?.nombre || "");

  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  // PAGINATION STATES
  const pedidosPorPagina = 5;
  const [pedidoOffset, setPedidoOffset] = useState(0);

  // Function to save user data to sessionStorage
  const saveUserDataToSession = (userData) => {
    sessionStorage.setItem("userData", JSON.stringify(userData));
  };

  // Reset all state when logging out
  const resetState = () => {
    setPedidos([]);
    setDecodedInfo({});
    setContentReady(false);
    setTelefono("");
    setDireccion("");
    setEmail("");
    setNombre("");
    setPedidoOffset(0);
  };

  // Load user data
  const loadUserData = async (userId, authToken) => {
    try {
      const response = await getUsuarioById(userId, authToken);
      const userData = {
        telefono: response.data.telefono || "",
        direccion: response.data.direccion || "",
        email: response.data.email || "",
        nombre: response.data.nombre || "",
      };

      setTelefono(userData.telefono);
      setDireccion(userData.direccion);
      setEmail(userData.email);
      setNombre(userData.nombre);

      localStorage.setItem("direccion", userData.direccion);
      saveUserDataToSession(userData);

      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Load user orders
  const loadUserOrders = async (authToken) => {
    try {
      const response = await getPedidosByUsuario(authToken);
      setPedidos(response.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setPedidos([]);
    }
  };

  // Main useEffect to handle authentication state
  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      setContentReady(false);

      // Check if user is logged in based on token
      const hasValidToken = !!token;
      setIsLoggedIn(hasValidToken);

      if (hasValidToken) {
        try {
          const decoded = jwtDecode(token);
          setDecodedInfo(decoded);

          if (!isAdmin) {
            // For regular users, load both orders and profile data
            await Promise.all([
              loadUserOrders(token),
              loadUserData(decoded.id, token),
            ]);
          }

          // Set content as ready regardless of admin status
          setContentReady(true);
          setLoading(false);
        } catch (error) {
          console.error("Error processing token:", error);
          // If token is invalid, reset state
          resetState();
          setLoading(false);
        }
      } else {
        // Not logged in, reset state
        resetState();
        setLoading(false);
      }
    };

    initializeProfile();
  }, [token, isAdmin]);

  // Cálculos para la paginación - moved here to avoid errors if pedidos changes
  const pedidosOrdenados =
    pedidos.length > 0 ? [...pedidos].sort((a, b) => b.id - a.id) : [];
  const endOffset = pedidoOffset + pedidosPorPagina;
  const currentPedidos = pedidosOrdenados.slice(pedidoOffset, endOffset);
  const pageCount = Math.ceil(pedidosOrdenados.length / pedidosPorPagina);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * pedidosPorPagina) % pedidosOrdenados.length;
    setPedidoOffset(newOffset);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    resetState();
    setIsLoggedIn(false);
    refreshAuth();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setShowMsg(false);

    try {
      await updateUsuario(
        decodedInfo.id,
        { nombre, telefono, direccion },
        token
      );

      // Update sessionStorage with new data
      const updatedUserData = {
        telefono,
        direccion,
        email,
        nombre,
      };
      saveUserDataToSession(updatedUserData);

      // Update localStorage for direccion
      localStorage.setItem("direccion", direccion || "");

      setMsg("Perfil actualizado correctamente.");
      setShowMsg(true);
      setEditMode(false);

      // Hide message with fade effect after 2 seconds
      setTimeout(() => {
        setShowMsg(false);
      }, 2000);
    } catch (err) {
      setMsg("Error al actualizar perfil.");
      setShowMsg(true);
    }
  };

  // Show loading state
  if (loading && !contentReady) return <Loading />;

  // Show login page if not authenticated
  if (!isLoggedIn && !isSigningUp) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh] bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Login
          setIsSigningUp={setIsSigningUp}
          setIsLoggedIn={(value) => {
            setIsLoggedIn(value);
            // Don't set contentReady here - let the useEffect handle it
          }}
        />
      </motion.div>
    );
  }

  // Show signup page
  if (!isLoggedIn && isSigningUp) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh] bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SignUp
          setIsSigningUp={setIsSigningUp}
          setIsLoggedIn={(value) => {
            setIsLoggedIn(value);
            // Don't set contentReady here - let the useEffect handle it
          }}
        />
      </motion.div>
    );
  }

  // Only render profile content when both logged in and content is ready
  if (!contentReady) return <Loading />;

  const accentColor = isAdmin ? "CA8A04" : "3F6212";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nombre ? nombre[0] : "U"
  )}&background=${accentColor}&color=fff&size=128&font-size=0.5&bold=true`;

  return (
    <div>
      <motion.button
        onClick={handleLogout}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="absolute top-9 right-6 z-10 cursor-pointer flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors duration-200"
      >
        <LogOut size={25} strokeWidth={2} color="var(--color-secondary)" />
      </motion.button>

      <motion.div
        className="bg-slate-50 min-h-screen"
        key="profile-page"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          {/* Encabezado del perfil */}
          <motion.div
            className="bg-white shadow-sm p-6 rounded-xl mb-8 relative"
            variants={cardAnimation}
          >
            <div className="flex items-center gap-6">
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                {/* Foto de perfil */}
                {nombre && (
                  <img
                    src={avatarUrl}
                    alt={`Avatar de ${nombre}`}
                    className="rounded-full w-16 h-16"
                  />
                )}
              </motion.div>
              <motion.div variants={itemAnimation}>
                <h1 className="text-3xl font-bold text-slate-800">
                  {nombre || "Usuario"}
                </h1>
                <p className="text-slate-500">{email}</p>
                <motion.span
                  className={`mt-2 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${
                    isAdmin
                      ? "bg-yellow-100 text-yellow-700"
                      : isRepartidor
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <ShieldCheck size={14} />
                  {isAdmin ? "Dueño" : isRepartidor ? "Repartidor" : "Cliente"}
                </motion.span>
              </motion.div>
            </div>

            {isAdmin && (
              <motion.div className="ml-auto mt-4 " variants={itemAnimation}>
                <Link
                  to="/admin"
                  className="px-4 w-32  py-2 bg-[var(--color-dark-gray)] text-white rounded-lg transition-all block"
                >
                  <motion.span
                    className="inline-block w-full text-center"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Panel Admin
                  </motion.span>
                </Link>
              </motion.div>
            )}
            <motion.button
              className="hidden sm:block sm:absolute top-4 right-4 hover:text-red-600 "
              onClick={() => handleLogout()}
            >
              <motion.span
                className=" underline cursor-pointer text-red-600"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Cerrar sesión
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Contenido principal */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna de Información Personal */}
            <motion.aside className="lg:col-span-1" variants={cardAnimation}>
              <motion.div
                className="bg-white shadow-sm p-6 rounded-xl h-full"
                variants={itemAnimation}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    className="text-xl font-semibold text-slate-800"
                    variants={itemAnimation}
                  >
                    Información Personal
                  </motion.h2>

                  {!editMode && (
                    <motion.button
                      onClick={() => setEditMode(true)}
                      className="cursor-pointer text-sm flex items-center gap-1.5 text-[var(--color-dark-gray)] font-medium"
                      whileHover={{ scale: 1.05, x: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SquarePen size={16} />
                      Editar
                    </motion.button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!editMode ? (
                    <motion.div
                      className="space-y-4"
                      key="info-display"
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20 }}
                      variants={itemAnimation}
                    >
                      {[
                        { icon: Mail, label: "Email", value: email },
                        {
                          icon: Phone,
                          label: "Teléfono",
                          value: telefono,
                          placeholder: "No ingresado",
                        },
                        {
                          icon: User,
                          label: "Nombre",
                          value: nombre,
                          placeholder: "No ingresado",
                        },
                        {
                          icon: MapPin,
                          label: "Dirección",
                          value: direccion,
                          placeholder: "No ingresada",
                        },
                      ].map(
                        ({ icon: Icon, label, value, placeholder }, index) => (
                          <motion.div
                            key={label}
                            className="flex items-start gap-4"
                            variants={listItemAnimation}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                          >
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            >
                              <Icon
                                className="w-5 h-5 text-slate-400 mt-0.5"
                                strokeWidth={1.5}
                              />
                            </motion.div>
                            <div>
                              <p className="text-sm text-slate-500">{label}</p>
                              <motion.p
                                className="font-medium text-slate-700"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                {value || (
                                  <span className="text-slate-400 italic">
                                    {placeholder}
                                  </span>
                                )}
                              </motion.p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleSaveProfile}
                      className="space-y-4"
                      key="edit-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {[
                        {
                          label: "Nombre",
                          type: "text",
                          value: nombre,
                          onChange: setNombre,
                          placeholder: "Ingresa tu nombre",
                        },
                        {
                          label: "Teléfono",
                          type: "tel",
                          value: telefono,
                          onChange: setTelefono,
                          placeholder: "Ingresa tu teléfono",
                        },
                        {
                          label: "Dirección",
                          type: "text",
                          value: direccion,
                          onChange: setDireccion,
                          placeholder: "Ingresa tu dirección",
                        },
                      ].map(
                        (
                          { label, type, value, onChange, placeholder },
                          index
                        ) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { delay: index * 0.1 },
                            }}
                          >
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              {label}
                            </label>
                            <motion.input
                              type={type}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              placeholder={placeholder}
                              required
                              whileFocus={{
                                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                                borderColor: "rgb(59, 130, 246)",
                              }}
                            />
                          </motion.div>
                        )
                      )}

                      <motion.div
                        className="flex gap-3 pt-2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.3 },
                        }}
                      >
                        <motion.button
                          type="submit"
                          className="cursor-pointer px-4 py-2 bg-[var(--color-olive-dark)] text-white rounded-lg hover:bg-[var(--color-olive-dark)] transition-colors w-full"
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          Guardar Cambios
                        </motion.button>
                        <motion.button
                          type="button"
                          className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                          onClick={() => setEditMode(false)}
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          Cancelar
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="min-h-[32px] mt-4">
                  <AnimatePresence>
                    {showMsg && (
                      <motion.p
                        className="text-sm text-green-600 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          height: "auto",
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          height: 0,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{
                            scale: [0, 1.2, 1],
                            transition: {
                              times: [0, 0.6, 1],
                              duration: 0.5,
                            },
                          }}
                        >
                          <CheckCircle size={16} />
                        </motion.span>
                        {msg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.aside>

            {/* Columna de Pedidos */}
            <motion.section className="lg:col-span-2" variants={cardAnimation}>
              <motion.div
                className="bg-white shadow-sm p-6 rounded-xl h-full"
                variants={itemAnimation}
              >
                <motion.h2
                  className="text-xl font-semibold text-slate-800 mb-4"
                  variants={itemAnimation}
                >
                  Historial de Pedidos
                </motion.h2>

                {isAdmin ? (
                  <PedidosAdmin token={token} />
                ) : pedidos.length > 0 ? (
                  <motion.div>
                    <motion.ul className="space-y-4">
                      <AnimatePresence>
                        {currentPedidos.map((pedido, index) => (
                          <motion.li
                            key={pedido.id}
                            className="border border-slate-200/80 rounded-lg p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30"
                            variants={listItemAnimation}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: 20 }}
                            custom={index}
                            whileHover={{
                              scale: 1.01,
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            }}
                            layout
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-3">
                                <motion.span
                                  className="font-semibold text-slate-700"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                  Pedido #{pedido.id}
                                </motion.span>
                                <motion.span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    {
                                      pendiente:
                                        "bg-yellow-100 text-yellow-800",
                                      completado: "bg-green-100 text-green-800",
                                      cancelado: "bg-red-100 text-red-800",
                                    }[pedido.estado] ||
                                    "bg-slate-100 text-slate-800"
                                  }`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                  {pedido.estado}
                                </motion.span>
                              </div>
                              <motion.div
                                className="font-bold text-slate-800"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                ${pedido.total}
                              </motion.div>
                            </div>

                            <motion.ul
                              className="space-y-2 border-t border-slate-100 pt-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              {pedido.Items?.map((item, itemIndex) => (
                                <motion.li
                                  key={item.id}
                                  className="flex justify-between items-center text-sm"
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.5 + index * 0.1 + itemIndex * 0.05,
                                  }}
                                >
                                  <span className="text-slate-600">
                                    {item.nombre}
                                  </span>
                                  <span className="text-slate-500">
                                    x{item.PedidoItem.cantidad}
                                  </span>
                                </motion.li>
                              ))}
                            </motion.ul>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </motion.ul>

                    {pageCount > 1 && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.6, duration: 0.4 },
                        }}
                      >
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel="Siguiente"
                          onPageChange={handlePageClick}
                          pageCount={pageCount}
                          previousLabel="Anterior"
                          className="flex justify-center items-center gap-2 text-sm"
                          pageClassName="px-3 py-1.5 rounded-md border border-slate-200"
                          activeClassName="bg-blue-600 text-white border-blue-600"
                          previousClassName="px-3 py-1.5 rounded-md border border-slate-200"
                          nextClassName="px-3 py-1.5 rounded-md border border-slate-200"
                          disabledClassName="opacity-50 cursor-not-allowed"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3, duration: 0.5 },
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.5,
                      }}
                    >
                      <ShoppingBag
                        className="mx-auto h-12 w-12 text-slate-300 mb-4"
                        strokeWidth={1}
                      />
                    </motion.div>

                    <motion.h3
                      className="text-lg font-medium text-slate-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Aún no tienes pedidos
                    </motion.h3>

                    <motion.p
                      className="text-slate-500 mt-1 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      ¡Explora nuestros productos y haz tu primer pedido!
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link to="/" className="inline-block">
                        <motion.div
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-dark-gray)] text-white rounded-lg"
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          Ir al menú <ChevronRight size={16} />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.section>
          </main>
        </div>
      </motion.div>
    </div>
  );
}

export default Perfil;
