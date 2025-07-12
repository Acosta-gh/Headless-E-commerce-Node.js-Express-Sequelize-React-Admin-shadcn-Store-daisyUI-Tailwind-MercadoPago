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

function Perfil() {
    const { token, isAdmin, refreshAuth } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedInfo, setDecodedInfo] = useState({});
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // estados para editar perfil
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [msg, setMsg] = useState("");

    // PAGINATION STATES
    const pedidosPorPagina = 7;
    const [pedidoOffset, setPedidoOffset] = useState(0);


    useEffect(() => {
        setLoading(true);
        setIsLoggedIn(!!token);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setDecodedInfo(decoded);
                console.log("Decoded JWT:", decoded);
                
                if (!isAdmin) {
                    getPedidosByUsuario(token)
                        .then(response => {
                            setPedidos(response.data);
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error("Error fetching user orders:", error);
                            setLoading(false);
                        });
                    getUsuarioById(decoded.id, token)
                        .then(response => {
                            setTelefono(response.data.telefono || "");
                            setDireccion(response.data.direccion || "");
                            setEmail(response.data.email || "");
                            setNombre(response.data.nombre || "");
                            setLoading(false);
                            console.log("User data fetched:", response.data);
                        })
                        .catch(error => {
                            console.error("Error fetching user data:", error);
                            setTelefono("");
                            setDireccion("");
                            setLoading(false);
                        }); 
                } else {
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

    // ... paginación y pedidos ...

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setDecodedInfo({});
        refreshAuth();
        setPedidos([]);
        setLoading(false);
    };

    // manejar guardado de usuario
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            await updateUsuario(decodedInfo.id, { telefono, direccion }, token);
            setMsg("Perfil actualizado correctamente.");
            setEditMode(false);
           
        } catch (err) {
            setMsg("Error al actualizar perfil.");
        }
    };

    if (loading) {
        return <Loading />;
    }
    if (!isLoggedIn && !isSigningUp) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Login setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />
            </div>
        );
    }
    else if (!isLoggedIn && isSigningUp) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SignUp setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />
            </div>
        );
    }

    return (
        <Fade duration={500} triggerOnce>
            <div className="max-w-xl mx-auto  rounded-xl p-8 ">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
                <p className="text-lg font-semibold text-blue-800 mb-2">{nombre}</p>
                <p className="mb-4 text-gray-700">¿Estás listo para hacer un pedido?</p>
                {isAdmin && (
                    <Link
                        to="/admin"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
                    >
                        Ir al panel de administración
                    </Link>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-6"
                >
                    Cerrar sesión
                </button>

                {/* NUEVO: Perfil editable */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Tus datos:</h3>
                    {!editMode ? (
                        <div>
                            <div className="mb-2"><b>Email:</b> {email}</div>
                            <div className="mb-2"><b>Teléfono:</b> {telefono || <span className="text-gray-400">No ingresado</span>}</div>
                            <div className="mb-2"><b>Dirección:</b> {direccion || <span className="text-gray-400">No ingresada</span>}</div>
                            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setEditMode(true)}>Editar datos</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
                            <label>
                                Teléfono:
                                <input
                                    type="text"
                                    className="border px-2 py-1 rounded w-full"
                                    value={telefono}
                                    onChange={e => setTelefono(e.target.value)}
                                />
                            </label>
                            <label>
                                Dirección:
                                <input
                                    type="text"
                                    className="border px-2 py-1 rounded w-full"
                                    value={direccion}
                                    onChange={e => setDireccion(e.target.value)}
                                />
                            </label>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
                                <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditMode(false)}>Cancelar</button>
                            </div>
                        </form>
                    )}
                    {msg && <div className="mt-2 text-green-700">{msg}</div>}
                </div>

                <div className="mt-8">
                    {isAdmin ? (
                        <PedidosAdmin token={token} />
                    ) : (
                        <>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">Tus pedidos:</h3>
                            {pedidos.length > 0 ? (
                                <>
                                    <ul className="space-y-4">
                                        {currentPedidos.map(pedido => (
                                            <li key={pedido.id} className="border rounded-lg p-4 bg-gray-50 shadow">
                                                <div className="font-semibold text-gray-700 mb-2">
                                                    Pedido <span className="text-blue-600">#{pedido.id}</span>
                                                    <span className="ml-4 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                                                        {pedido.estado}
                                                    </span>
                                                    <span className="ml-4 text-green-700 font-bold">
                                                        Total: ${pedido.total}
                                                    </span>
                                                </div>
                                                <ul className="ml-4 list-disc text-gray-600">
                                                    {pedido.Items && pedido.Items.map(item => (
                                                        <li key={item.id} className="flex justify-between items-center py-0.5">
                                                            <span>{item.nombre}</span>
                                                            <span className="ml-2 text-sm text-gray-500">x {item.PedidoItem.cantidad}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                    {pedidosOrdenados.length > pedidosPorPagina && (
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel="Siguiente >"
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={pageCount}
                                            previousLabel="< Anterior"
                                            renderOnZeroPageCount={null}
                                            containerClassName="flex gap-2 justify-center my-4"
                                            pageClassName="px-2 py-1 bg-gray-200 rounded"
                                            activeClassName="bg-red-800 text-white"
                                            previousClassName="px-2 py-1 bg-gray-200 rounded"
                                            nextClassName="px-2 py-1 bg-gray-200 rounded"
                                            disabledClassName="opacity-50 cursor-not-allowed"
                                        />
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">No tienes pedidos aún.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Fade>
    )
}

export default Perfil;