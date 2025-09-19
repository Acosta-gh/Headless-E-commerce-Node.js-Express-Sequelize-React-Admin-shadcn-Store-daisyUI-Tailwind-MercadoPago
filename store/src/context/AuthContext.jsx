import React, { createContext, useContext, useEffect, useState } from "react";

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

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRepartidor, setIsRepartidor] = useState(false);

    // Verifica el token al montar y cuando cambia
    useEffect(() => {
        if (token) {
            const payload = parseJwt(token);

            if (!payload?.exp || payload.exp * 1000 < Date.now()) {
                setToken(null);
                setIsAdmin(false);
                localStorage.removeItem("token");
                return;
            }

            setIsAdmin(payload.admin);
            setIsRepartidor(payload.repartidor);
        } else {
            setIsAdmin(false);
            setIsRepartidor(false);
        }
    }, [token]);

    // Revisa el token periódicamente (cada minuto)
    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                const payload = parseJwt(token);
                if (!payload?.exp || payload.exp * 1000 < Date.now()) {
                    setToken(null);
                    setIsAdmin(false);
                    localStorage.removeItem("token");
                }
            }
        }, 60000); // 1 minuto

        return () => clearInterval(interval);
    }, [token]);

    const refreshAuth = () => {
        const newToken = localStorage.getItem("token");
        setToken(newToken);
    };

    return (
        <AuthContext.Provider value={{ token, isAdmin, isRepartidor, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);