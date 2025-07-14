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
import { Fade } from "react-awesome-reveal";
import { updateUsuario, getUsuarioById } from "../services/usuarioService.js";
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

// Function to get user data from sessionStorage (defined outside component to use in initial state)
const getUserDataFromSession = () => {
  const userData = sessionStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

function Perfil() {
  const { token, isAdmin, isRepartidor, refreshAuth } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedInfo, setDecodedInfo] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Cálculos para la paginación
  const endOffset = pedidoOffset + pedidosPorPagina;
  const pedidosOrdenados = [...pedidos].sort((a, b) => b.id - a.id);
  const currentPedidos = pedidosOrdenados.slice(pedidoOffset, endOffset);
  const pageCount = Math.ceil(pedidosOrdenados.length / pedidosPorPagina);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * pedidosPorPagina) % pedidosOrdenados.length;
    setPedidoOffset(newOffset);
  };

  // Function to save user data to sessionStorage
  const saveUserDataToSession = (userData) => {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  useEffect(() => {
    setLoading(true);
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedInfo(decoded);

        if (!isAdmin) {
          // Load orders
          getPedidosByUsuario(token)
            .then((response) => setPedidos(response.data))
            .catch((error) => console.error("Error fetching user orders:", error))
            .finally(() => {
              // If we already have data from sessionStorage, we can set loading to false
              if (sessionData) {
                setLoading(false);
              }
            });
          
          // Even if we have session data, still fetch from server to ensure data is fresh
          getUsuarioById(decoded.id, token)
            .then((response) => {
              const userData = {
                telefono: response.data.telefono || "",
                direccion: response.data.direccion || "",
                email: response.data.email || "",
                nombre: response.data.nombre || ""
              };
              
              setTelefono(userData.telefono);
              setDireccion(userData.direccion);
              setEmail(userData.email);
              setNombre(userData.nombre);
              
              localStorage.setItem("direccion", userData.direccion);
              saveUserDataToSession(userData);
              
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              // If we have session data, we can still show that even if the API call failed
              if (!sessionData) {
                setLoading(false);
              }
            });
        } else {
          // Admin doesn't need user data
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setDecodedInfo({});
        setLoading(false);
      }
    } else {
      setDecodedInfo({});
      setLoading(false);
    }
  }, [token, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userData"); // Clear session data on logout
    setIsLoggedIn(false);
    setDecodedInfo({});
    refreshAuth();
    setPedidos([]);
    setLoading(false);
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
        nombre
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

  // If we have session data, we can show content even while loading
  const shouldShowContent = !loading || (sessionData && isLoggedIn);

  if (loading && !sessionData) return <Loading />;
  if (!isLoggedIn && !isSigningUp) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <Login setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }
  if (!isLoggedIn && isSigningUp) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <SignUp setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />
      </div>
    );
  }

  const accentColor = isAdmin ? "CA8A04" : "3F6212";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nombre ? nombre[0] : "U"
  )}&background=${accentColor}&color=fff&size=128&font-size=0.5&bold=true`;

  return (
    <div className="bg-slate-50 min-h-screen">
      <button
        onClick={handleLogout}
        className="absolute top-9 right-6 cursor-pointer flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors duration-200"
      >
        <LogOut size={25} strokeWidth={2} color="var(--color-secondary)" />
      </button>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <Fade duration={500} triggerOnce>
          {/* Encabezado del perfil */}
          <div className="bg-white shadow-sm p-6 rounded-xl mb-8 relative ">
            <div className="flex items-center gap-6">
              <div className="relative">
                {/* Foto  de perfil */}
                <img
                  src={avatarUrl}
                  alt={`Avatar de ${nombre}`}
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{nombre}</h1>
                <p className="text-slate-500">{email}</p>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${
                    isAdmin
                      ? "bg-yellow-100 text-yellow-700"
                      : isRepartidor
                      ? "bg-s-100 text-green-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <ShieldCheck size={14} />
                  {isAdmin
                    ? "Administrador"
                    : isRepartidor
                    ? "Repartidor"
                    : "Cliente"}
                </span>
              </div>
            </div>
            {isAdmin && (
              <div className="ml-auto mt-4">
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-[var(--color-dark-gray)] text-white rounded-lg transition-colors text-center"
                >
                  Panel Admin
                </Link>
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna de Información Personal */}
            <aside className="lg:col-span-1">
              <Fade delay={100} triggerOnce>
                <div className="bg-white shadow-sm p-6 rounded-xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Información Personal
                    </h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="cursor-pointer text-sm flex items-center gap-1.5 text-[var(--color-dark-gray)] font-medium transition-colors"
                      >
                        <SquarePen size={16} />
                        Editar
                      </button>
                    )}
                  </div>

                  {!editMode ? (
                    <div className="space-y-4">
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
                      ].map(({ icon: Icon, label, value, placeholder }) => (
                        <div key={label} className="flex items-start gap-4">
                          <Icon
                            className="w-5 h-5 text-slate-400 mt-0.5"
                            strokeWidth={1.5}
                          />
                          <div>
                            <p className="text-sm text-slate-500">{label}</p>
                            <p className="font-medium text-slate-700">
                              {value || (
                                <span className="text-slate-400 italic">
                                  {placeholder}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <Fade cascade damping={0.1} duration={300}>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ingresa tu teléfono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Dirección
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ingresa tu dirección"
                            required
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-[var(--color-olive-dark)] text-white rounded-lg hover:bg-[var(--color-olive-dark)] transition-colors w-full"
                          >
                            Guardar Cambios
                          </button>
                          <button
                            type="button"
                            className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            onClick={() => setEditMode(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </Fade>
                    </form>
                  )}
                  
                  <div className="min-h-[32px] mt-4">
                    {showMsg && (
                      <Fade duration={300}>
                        <p className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle size={16} />
                          {msg}
                        </p>
                      </Fade>
                    )}
                  </div>
                </div>
              </Fade>
            </aside>

            {/* Columna de Pedidos */}
            <section className="lg:col-span-2">
              <Fade delay={100} triggerOnce>
                <div className="bg-white shadow-sm p-6 rounded-xl h-full">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Historial de Pedidos
                  </h2>
                  {isAdmin ? (
                    <PedidosAdmin token={token} />
                  ) : pedidos.length > 0 ? (
                    <>
                      <ul className="space-y-4">
                        {currentPedidos.map((pedido) => (
                          <Fade
                            key={pedido.id}
                            cascade
                            damping={0.1}
                            triggerOnce
                          >
                            <li className="border border-slate-200/80 rounded-lg p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-slate-700">
                                    Pedido #{pedido.id}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      {
                                        pendiente:
                                          "bg-yellow-100 text-yellow-800",
                                        completado:
                                          "bg-green-100 text-green-800",
                                        cancelado: "bg-red-100 text-red-800",
                                      }[pedido.estado] ||
                                      "bg-slate-100 text-slate-800"
                                    }`}
                                  >
                                    {pedido.estado}
                                  </span>
                                </div>
                                <div className="font-bold text-slate-800">
                                  ${pedido.total}
                                </div>
                              </div>
                              <ul className="space-y-2 border-t border-slate-100 pt-3">
                                {pedido.Items?.map((item) => (
                                  <li
                                    key={item.id}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <span className="text-slate-600">
                                      {item.nombre}
                                    </span>
                                    <span className="text-slate-500">
                                      x{item.PedidoItem.cantidad}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </Fade>
                        ))}
                      </ul>
                      {pageCount > 1 && (
                        <div className="mt-6">
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
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                      <ShoppingBag
                        className="mx-auto h-12 w-12 text-slate-300 mb-4"
                        strokeWidth={1}
                      />
                      <h3 className="text-lg font-medium text-slate-700">
                        Aún no tienes pedidos
                      </h3>
                      <p className="text-slate-500 mt-1 mb-4">
                        ¡Explora nuestros productos y haz tu primer pedido!
                      </p>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-dark-gray)] text-white rounded-lg transition-colors"
                      >
                        Ir al menú <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </Fade>
            </section>
          </main>
        </Fade>
      </div>
    </div>
  );
}

export default Perfil;