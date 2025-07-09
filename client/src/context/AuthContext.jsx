import React, { createContext, useContext, useEffect, useState } from "react";

// Decodifica el payload del JWT (sin dependencias externas)
function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

const AuthContext = createContext();

/**
 * Auth Context Provider para la aplicación.
 * 
 * Este componente gestiona el estado de autenticación del usuario, incluyendo el token JWT y el rol de administrador.
 * 
 * - Al montar o cuando cambia el token, verifica si el token es válido y no ha expirado.
 * - Si el token es válido, determina si el usuario es administrador según el payload del JWT.
 * - Si el token ha expirado o no existe, limpia el estado y el almacenamiento local.
 * - Expone un método `refreshAuth` para recargar el token desde el almacenamiento local, útil para login/logout.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos envueltos por el proveedor.
 * @returns {JSX.Element} Proveedor de contexto de autenticación.
 */
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            const payload = parseJwt(token);

            // Verificar expiración
            if (!payload?.exp || payload.exp * 1000 < Date.now()) {
                // El token está expirado
                setToken(null);
                setIsAdmin(false);
                localStorage.removeItem("token"); // Limpia el storage
                return;
            }

            setIsAdmin(payload.admin);
            console.log("Token válido, rol de administrador:", payload.admin);
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    const refreshAuth = () => {
        const newToken = localStorage.getItem("token");
        setToken(newToken);
    };

    return (
        // Los componentes hijos tendrán acceso al contexto de autenticación, estos siendo token y isAdmin que sirven para verificar el estado de autenticación y el rol del usuario.
       // refreshAuth es una función que permite recargar el token desde el almacenamiento local, útil para manejar cambios de sesión.
       <AuthContext.Provider value={{ token, isAdmin, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);