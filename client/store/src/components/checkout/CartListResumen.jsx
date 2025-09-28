import React from "react";

function CartListResumen({ cart }) {
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-lg font-bold mb-4">Tu carrito está vacío</h2>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div>
      <ul className="bg-base-100 rounded-lg shadow divide-y divide-base-200">
        {cart.map((item, index) => (
          <React.Fragment key={item.id}>
            <li className="py-4 flex justify-between items-center px-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center gap-4">
                {item.imagenUrl && (
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-semibold">{item.nombre}</div>
                  <div className="text-sm">
                    Cantidad: {item.cantidad} &mdash; {item.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })} c/u
                  </div>
                </div>
              </div>
              <div className="font-bold text-right ml-4">
                {(item.precio * item.cantidad).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
              </div>
            </li>
            {index < cart.length - 1 && <div className="divider my-0"></div>}
          </React.Fragment>
        ))}
      </ul>
      <div className="text-right mt-6 text-xl font-bold">Total:{total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</div>
    </div>
  );
}

export default CartListResumen;