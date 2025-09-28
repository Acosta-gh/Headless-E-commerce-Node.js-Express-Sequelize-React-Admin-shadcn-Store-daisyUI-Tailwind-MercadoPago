import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

export default function useVerifyAccount(token) {
  const [status, setStatus] = useState("checking"); // 'checking' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token no proporcionado");
      return;
    }

    let mounted = true;

    authService
      .verifyEmail(token)
      .then((res) => {
        if (!mounted) return;
        setStatus("success");
        setMessage(res.message);
        console.log("Cuenta verificada con éxito, redirigiendo a perfil...", res);
        setTimeout(() => navigate("/profile"), 2000);
      })
      .catch((err) => {
        if (!mounted) return;
        setStatus("error");
        setMessage(err.message);
      });

    return () => {
      mounted = false;
    };
  }, [token, navigate]);

  return { status, message};
}
