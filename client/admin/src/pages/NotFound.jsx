import React, { useEffect } from "react";
import { useAlert } from "../context/AlertContext";

function NotFound() {
  const { showAlert } = useAlert() || {};

  useEffect(() => {
    if (typeof showAlert === "function") {
      showAlert("Página no encontrada", "error");
    }
  }, [showAlert]);

  return <div>NotFound</div>;
}

export default NotFound;