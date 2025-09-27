import { useState, useEffect, useRef } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import useUsers from "@/hooks/useUsers";

// --- Configuración Inicial ---

// Clave pública de Mercado Pago (obtenida de variables de entorno de Vite)
const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey);
} else {
  console.error(
    "Error: VITE_MP_PUBLIC_KEY no está configurada en el archivo .env del frontend."
  );
}

// URL base de la API del backend
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * MercadoPagoButton
 *
 * Componente que gestiona la creación de una preferencia de pago en el backend
 * y renderiza el botón de pago de Mercado Pago.
 *
 * Lógica principal:
 * 1. Al montarse, verifica el carrito y los datos del usuario.
 * 2. Envía una petición POST al backend con los items del carrito, el ID del usuario
 *    y la dirección de entrega para crear un "Pedido" y una "Preferencia de Pago".
 * 3. Utiliza un `useRef` para prevenir la doble ejecución de la petición en el modo
 *    de desarrollo de React (StrictMode), lo que evita errores de "database is locked" con SQLite.
 * 4. Una vez que recibe el ID de la preferencia, renderiza el componente <Wallet /> de Mercado Pago.
 *
 * @component
 * @returns {JSX.Element} Un mensaje de estado (carga, error) o el botón de pago de Mercado Pago.
 */
export default function MercadoPagoButton() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = useCart();
  const { userData, loading } = useUsers();
  console.log(userData);

  // 'useRef' para controlar que la petición de creación de preferencia se ejecute solo una vez.
  // Esto es crucial en React 18+ con StrictMode, que ejecuta los useEffect dos veces en desarrollo.
  const isCreatingRef = useRef(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    const createPreference = async () => {
      // Si ya hay una petición en curso, la evitamos para no duplicarla.
      if (isCreatingRef.current) {
        return;
      }

      // Validaciones previas antes de contactar al backend.
      if (!cart || cart.length === 0) {
        setError("El carrito está vacío.");
        setIsLoading(false);
        return;
      }

      // Marcamos el inicio de la operación.
      isCreatingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Obtenemos los datos del usuario guardados en la sesión.

        if (!userData || !userData.id || !userData.direccion) {
          throw new Error(
            "No se encontraron datos de usuario o dirección. Por favor, inicia sesión de nuevo."
          );
        }

        // Mapeamos el carrito para enviar solo los datos necesarios al backend.
        const itemsParaBackend = cart.map((item) => ({
          itemId: item.id,
          cantidad: item.cantidad,
        }));

        const token = localStorage.getItem("token"); // o localStorage.getItem("authToken")

        // Petición al backend para crear el pedido y la preferencia de pago.
        const response = await axios.post(
          `${apiUrl}/mercadopago/create_preference`,
          {
            items: itemsParaBackend,
            usuarioId: userData.id,
            direccionEntrega: userData.direccion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { id } = response.data;
        if (id) {
          setPreferenceId(id);
        } else {
          throw new Error(
            "El servidor no devolvió un ID de preferencia válido."
          );
        }
      } catch (err) {
        console.error("Error al crear la preferencia:", err);
        // Mostramos un mensaje de error genérico y amigable al usuario.
        setError(
          err.response?.data?.message ||
            "No se pudo generar el link de pago. Intenta de nuevo."
        );
      } finally {
        // Marcamos el final de la operación, haya tenido éxito o no.
        isCreatingRef.current = false;
        setIsLoading(false);
      }
    };

    createPreference();
  }, [cart, userData, loading]); // El efecto se re-ejecuta si el carrito cambia.

  if (isLoading) {
    return (
      <p className="text-gray-600 mt-2 text-sm">
        Iniciando pago seguro con Mercado Pago...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 mt-2 text-sm">{error}</p>;
  }

  return (
    <div className="w-full max-w-sm mt-4">
      {preferenceId && (
        <Wallet
          initialization={{ preferenceId }}
          customization={{
            theme: "dark", // o "default"
            valueProp: "smart_option", // "pay_button" o "smart_option"
            customStyle: {
              valuePropColor: "black", // "blue", "white" o "black" según el theme
              buttonHeight: "56px",
              borderRadius: "14px",
              verticalPadding: "14px",
              horizontalPadding: "24px",
              // hideValueProp: true, // Descomenta para ocultar la propuesta de valor
            },
          }}
        />
      )}
    </div>
  );
}
