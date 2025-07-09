import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

import Login from "../components/Perfil/Login.jsx";
import SignUp from "../components/Perfil/SignUp.jsx";

import { getPedidosByUsuario } from "../services/pedidoService.js"

function Perfil() {
    const { token, isAdmin, refreshAuth } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedInfo, setDecodedInfo] = useState({});
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        setIsLoggedIn(!!token);
        if (token) {
            try {
                // Decodificar el token JWT para obtener la información del usuario y saludarlo
                const decoded = jwtDecode(token);
                setDecodedInfo(decoded);
                console.log("Información decodificada del token:", decoded);
                // Obtener los pedidos del usuario
                getPedidosByUsuario(token)
                    .then(response => {
                        setPedidos(response.data);
                        console.log("Pedidos del usuario:", response.data);
                    })
                    .catch(error => {
                        console.error("Error fetching user orders:", error);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
                setDecodedInfo({});
            }
        } else {
            setDecodedInfo({});
        }
    }, [token]);



    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setDecodedInfo({});
        refreshAuth();
    };

    if (!isLoggedIn && !isSigningUp) {
        return <Login setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />;
    }
    else if (!isLoggedIn && isSigningUp) {
        return <SignUp setIsSigningUp={setIsSigningUp} setIsLoggedIn={setIsLoggedIn} />;
    }

    return (
        <div>
            <h2>Bienvenido</h2>
            <p>{decodedInfo.nombre}</p>
            <p>¿Estás listo para hacer un pedido?</p>
            {isAdmin && (
                <Link to="/admin" className="text-blue-500 hover:underline">
                    Ir al panel de administración
                </Link>
            )}
            <button onClick={handleLogout}>Cerrar sesión</button>

            {pedidos.length > 0 ? (
                <div>
                    <h3>Tus pedidos:</h3>
                    <ul>
                        {pedidos.map(pedido => (
                            <li key={pedido.id}>
                                Pedido #{pedido.id} - Estado: {pedido.estado} - Total: {pedido.total}
                                <ul>
                                    {pedido.Items && pedido.Items.map(item => (
                                        <li key={item.id}>
                                            {item.nombre} x {item.PedidoItem.cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No tienes pedidos aún.</p>
            )}
        </div>
    )
}

export default Perfil