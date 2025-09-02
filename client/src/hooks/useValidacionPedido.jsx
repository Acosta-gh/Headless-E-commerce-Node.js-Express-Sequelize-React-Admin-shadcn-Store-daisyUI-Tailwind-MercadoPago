import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Hook de React para validar las pre-condiciones de un pedido.
 * No realiza efectos secundarios (como alertas), solo devuelve el resultado de la validación.
 * @param {{ cart: Array, token: string, direccion: string }} props
 * @returns {function(): {esValido: boolean, mensaje: string}} Una función que, al ser llamada, devuelve un objeto con el estado de la validación y un mensaje descriptivo.
 */
export function useValidacionPedido({ cart, token, direccion }) {
  
  return useCallback(() => {
    // 1. Validar que el usuario esté logueado (token existe)
    if (!token) {
      return { 
        esValido: false, 
        mensaje: 'Debes iniciar sesión para continuar.' 
      };
    }

    // 2. Validar que el token sea un JWT válido
    try {
      jwtDecode(token);
    } catch (e) {
      return { 
        esValido: false, 
        mensaje: 'Tu sesión es inválida. Por favor, inicia sesión de nuevo.' 
      };
    }

    // 3. Validar que el carrito no esté vacío
    if (!cart || cart.length === 0) {
      return { 
        esValido: false, 
        mensaje: 'Tu carrito está vacío. Agrega productos para continuar.' 
      };
    }
    
    // 4. Validar que exista una dirección de entrega
    if (!direccion || direccion.trim() === '') {
      return { 
        esValido: false, 
        mensaje: 'Debes indicar una dirección de entrega en tu perfil.' 
      };
    }

    // 5. Si todas las validaciones pasan
    return { 
      esValido: true, 
      mensaje: 'El pedido está listo para ser procesado.' 
    };

  }, [cart, token, direccion]);
}