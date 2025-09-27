import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Fade } from "react-awesome-reveal";

function Cart() {
  const { user } = useAuth();
  const {
    cart,
    vaciarCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Ir a la tienda
        </button>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-8 relative top-20">
      <Fade duration={500} >
        <h2 className="text-2xl font-bold mb-6">Carrito de compras</h2>

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
                    <div className="text-gray-500 text-sm">
                      Cantidad: {item.cantidad} &mdash; ${item.precio} c/u
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() =>
                      item.cantidad > 1 && quitarDelCarrito(item.id)
                    }
                  >
                    -
                  </button>
                  <button
                    className={`btn btn-xs btn-outline ${
                      item.cantidad >= item.stock
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      item.cantidad < item.stock && agregarAlCarrito(item, 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="btn btn-xs btn-error hover:bg-red-600 p-1"
                    onClick={() => eliminarDelCarrito(item.id)}
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="font-bold text-right ml-4">
                  ${item.precio * item.cantidad}
                </div>
              </li>
              {index < cart.length - 1 && <div className="divider my-0"></div>}
            </React.Fragment>
          ))}
        </ul>

        <div className="text-right mt-6 text-xl font-bold">Total: ${total}</div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            className="btn btn-error btn-outline hover:btn-error"
            onClick={vaciarCarrito}
          >
            Vaciar carrito
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/checkout")}
          >
            Finalizar compra
          </button>
        </div>
      </Fade>
    </div>
  );
}

export default Cart;
