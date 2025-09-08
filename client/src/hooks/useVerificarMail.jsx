import { useEffect, useState } from "react";
import { verificarEmail } from "../services/verifyService";

export default function useVerificarMail() {
  const [estado, setEstado] = useState({
    cargando: true,
    mensaje: "Verificando...",
    exito: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");

    if (!token) {
      setEstado({
        cargando: false,
        mensaje: "Falta el token en la URL.",
        exito: false,
      });
      return;
    }

    token = token.replace(/\?+$/, "");

    verificarEmail(token)
      .then((data) => {
        setEstado({
          cargando: false,
          mensaje: data.message || (data.exito ? "Cuenta verificada." : "Error verificando token."),
          exito: !!data.exito,
        });
      })
      .catch((error) => {
        setEstado({
          cargando: false,
          mensaje: error.message || "Error verificando token.",
          exito: false,
        });
      });
  }, []);

  return estado;
}