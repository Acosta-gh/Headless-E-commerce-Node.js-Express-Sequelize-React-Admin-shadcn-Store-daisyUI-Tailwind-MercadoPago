import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export function useValidacionPedido({ cart, token, direccion }) {
  return useCallback(() => {
    if (!cart || cart.length === 0) {
      alert("El carrito está vacío.");
      return false;
    }
    if (!token) {
      alert("Debes iniciar sesión para continuar.");
      return false;
    }
    try {
      jwtDecode(token);
    } catch (e) {
      alert("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
      return false;
    }
    if (!direccion) {
      alert("Debes indicar una dirección de entrega en tu perfil.");
      return false;
    }
    return true;
  }, [cart, token, direccion]);
}