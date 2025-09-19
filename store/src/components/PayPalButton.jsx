/*
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

/**
 * Componente PayPalButton
 *
 * Renderiza un botón de pago de PayPal utilizando el SDK de PayPal para React.
 * Permite personalizar el monto, la moneda y manejar los eventos principales del flujo de pago.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string|number} props.amount - Monto total a pagar.
 * @param {string} props.currency - Moneda en la que se realizará el pago (por ejemplo, "USD").
 * @param {function} props.createOrder - Función que crea la orden de pago en PayPal.
 * @param {function} props.onApprove - Función que se ejecuta cuando el pago es aprobado.
 * @param {function} props.onError - Función que se ejecuta si ocurre un error durante el proceso de pago.
 * @param {boolean} props.disabled - Indica si el botón de PayPal debe estar deshabilitado.
 *
 * @returns {JSX.Element} El botón de PayPal y el resumen del total a pagar.

export default function PayPalButton({
  amount,
  currency,
  createOrder,
  onApprove,
  onError,
  disabled,
}) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="text-center text-gray-500">Cargando PayPal...</div>;
  }

  return (
    <div className="w-full max-w-sm">
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        forceReRender={[amount, currency]}
        disabled={disabled}
      />
       <div className="text-xs text-gray-500 mt-2 text-center">
         Total a pagar (aprox.): {currency} {amount}
       </div>
    </div>
  );
}
 */