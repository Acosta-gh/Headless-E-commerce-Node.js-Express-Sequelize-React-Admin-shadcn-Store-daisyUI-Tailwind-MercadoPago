import { useEffect, useRef } from "react";

/**
 * PayPalButton
 * Props:
 *  - amount: string (ej: "25.00")
 *  - currency: string (por defecto "USD")
 *  - onSuccess: function(details)
 *  - onError: function(error)
 *  - extraData: object adicional que enviamos al backend en create-order
 *  - disabled: boolean para no permitir interacción (no renderiza botones activos)
 */
export default function PayPalButton({
    amount = "0.00",
    currency = "USD",
    onSuccess,
    onError,
    extraData = {},
    disabled = false,
}) {
    const paypalRef = useRef(null);

    useEffect(() => {
        if (disabled) {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = "<div class='text-gray-400 text-sm'>PayPal deshabilitado</div>";
            }
            return;
        }

        const renderPayPalButton = () => {
            if (!window.paypal || !paypalRef.current) return;

            // Limpia si hubiera un render previo
            paypalRef.current.innerHTML = "";

            window.paypal
                .Buttons({
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "pill",
                        label: "pay",
                    },
                    createOrder: async () => {
                        try {
                            const res = await fetch(
                                "http://localhost:3000/api/paypal/create-order",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        amount,
                                        currency,
                                        ...extraData, // puedes usar esto en backend para construir purchase_units
                                    }),
                                }
                            );
                            const data = await res.json();
                            if (!data.id) {
                                throw new Error("Respuesta inválida al crear la orden.");
                            }
                            return data.id;
                        } catch (err) {
                            console.error(err);
                            alert("Error al crear orden: " + err.message);
                            if (onError) onError(err);
                        }
                    },
                    onApprove: async (data) => {
                        try {
                            const res = await fetch(
                                `http://localhost:3000/api/paypal/capture-order/${data.orderID}`,
                                {
                                    method: "POST",
                                }
                            );
                            const details = await res.json();
                            if (details?.status !== "COMPLETED") {
                                alert("El pago no se completó correctamente.");
                                return;
                            }
                            if (onSuccess) onSuccess(details);
                        } catch (err) {
                            console.error(err);
                            alert("Error al capturar orden: " + err.message);
                            if (onError) onError(err);
                        }
                    },
                    onError: (err) => {
                        console.error(err);
                        alert("Error en el pago: " + err.message);
                        if (onError) onError(err);
                    },
                })
                .render(paypalRef.current);
        };

        if (window.paypal) {
            renderPayPalButton();
        } else {
            const script = document.createElement("script");
            // Reemplaza YOUR_CLIENT_ID por tu client-id real; usa &currency=USD si quieres fijarlo desde el SDK
            const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&currency=${currency}`;

            script.async = true;
            script.onload = renderPayPalButton;
            document.body.appendChild(script);
        }

        return () => {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = "";
            }
        };
    }, [amount, currency, extraData, onSuccess, onError, disabled]);

    return (
        <div className="w-full max-w-sm">
            <div ref={paypalRef}></div>
            <div className="text-xs text-gray-500 mt-2 text-center">
                Total a pagar: {currency} {amount}
            </div>
        </div>
    );
}