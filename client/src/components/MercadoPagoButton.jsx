import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { useCart } from "../context/CartContext"; 

const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey);
} else {
  console.error("Error: VITE_MP_PUBLIC_KEY no está configurada.");
}

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * MercadoPagoButton
 *
 * Componente React que gestiona la integración con Mercado Pago para iniciar el proceso de pago.
 * Obtiene el carrito de compras desde el contexto, crea una preferencia de pago en el backend
 * y muestra el botón de pago de Mercado Pago utilizando el componente Wallet.
 *
 * Estados:
 * - preferenceId: ID de la preferencia de pago generada por el backend.
 * - isLoading: Indica si se está generando la preferencia de pago.
 * - error: Mensaje de error en caso de que falle la generación de la preferencia.
 *
 * Efectos:
 * - Al montar el componente o cuando cambia el carrito, intenta crear una nueva preferencia de pago.
 *
 * Renderizado:
 * - Muestra un mensaje de carga mientras se genera la preferencia.
 * - Muestra un mensaje de error si ocurre algún problema.
 * - Muestra el botón de pago de Mercado Pago si la preferencia fue creada exitosamente.
 *
 * @component
 * @returns {JSX.Element} El botón de pago de Mercado Pago o mensajes de estado.
 */
export default function MercadoPagoButton() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true para cargar automáticamente
  const [error, setError] = useState(null);
  const { cart } = useCart(); // Obtenemos el carrito para pasarlo al backend

  useEffect(() => {
    const createPreference = async () => {
      if (!cart || cart.length === 0) {
        setError("El carrito está vacío.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        // Mapeamos el carrito para enviar solo los datos necesarios y seguros
        const itemsParaBackend = cart.map(item => ({
          itemId: item.id,
          cantidad: item.cantidad,
        }));

        const response = await axios.post(`${apiUrl}mercadopago/create_preference`, {
          items: itemsParaBackend,
        });
        
        const { id } = response.data;
        if (id) {
          setPreferenceId(id);
        } else {
            throw new Error("No se recibió un ID de preferencia válido.");
        }
      } catch (err) {
        console.error("Error al crear la preferencia:", err);
        setError("No se pudo generar el link de pago. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    createPreference();
  }, [cart]);

  if (isLoading) {
    return <p className="text-gray-600 mt-2 text-sm">Iniciando pago con Mercado Pago...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-2 text-sm">{error}</p>;
  }

  return (
    <div className="w-full max-w-sm">
      {preferenceId && (
        <Wallet 
          initialization={{ preferenceId }} 
          customization={{ texts: { valueProp: 'smart_option' } }} 
        />
      )}
    </div>
  );
}