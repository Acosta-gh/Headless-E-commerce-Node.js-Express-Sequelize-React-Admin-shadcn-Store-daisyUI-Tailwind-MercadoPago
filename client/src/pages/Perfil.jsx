import React, { useEffect } from 'react'
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Perfil() {
    const { token, isAdmin, refreshAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (!token) return null;

    return (
        <div>
            <p>Estás logueado.</p>
            {isAdmin && <p>Eres admin.</p>}
            <button onClick={refreshAuth}>Refrescar Auth</button>
        </div>
    )
}

export default Perfil