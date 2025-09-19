import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartDropdown() {
  const {
    totalItems,
    totalPrecio,
    vaciarCarrito,
    cart,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
  } = useCart();

  const [abierto, setAbierto] = useState(false);
  const [visible, setVisible] = useState(false); // para la animación
  const dropdownRef = useRef(null);

  // Controla fade al abrir/cerrar
  useEffect(() => {
    if (abierto) {
      setVisible(true);
    } else {
      // delay para animación de fade out
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [abierto]);

  // Cierra el dropdown si clickeas fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cada vez que el carrito cambie, dispara fade
  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => {
    if (abierto) setFadeKey((k) => k + 1);
  }, [cart, abierto]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del carrito */}
      <button
        className="btn btn-ghost btn-circle relative"
        onClick={() => setAbierto((prev) => !prev)}
      >
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4m-8 2a2 2 0 11-4 0 2 2 0 014 0"
            />
          </svg>
          {totalItems > 0 && (
            <span className="badge badge-sm indicator-item badge-secondary">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown controlado con fade */}
      {visible && (
        <div
          key={fadeKey} // reinicia animación cuando cambia el carrito
          className={`absolute right-0 mt-3 w-80 bg-base-100 shadow-xl rounded-lg z-50 transition-opacity duration-200 ${
            abierto ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="card-body max-h-96 overflow-y-auto">
            {totalItems > 0 ? (
              <>
                <span className="text-lg font-bold">
                  {totalItems} producto{totalItems !== 1 && "s"}
                </span>
                <ul className="divide-y divide-base-200">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between py-2 transition-opacity duration-150"
                    >
                      <div className="flex items-center gap-2">
                        {item.imagenUrl && (
                          <img
                            src={item.imagenUrl}
                            alt={item.nombre}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{item.nombre}</p>
                          <p className="text-xs text-gray-500">
                            x{item.cantidad} (${item.precio * item.cantidad})
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.cantidad > 1) quitarDelCarrito(item.id);
                          }}
                        >
                          -
                        </button>
                        <button
                          className={`btn btn-xs btn-outline ${
                            item.cantidad >= item.stock
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.cantidad < item.stock)
                              agregarAlCarrito(item, 1);
                          }}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-xs  btn-outline btn-error p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarDelCarrito(item.id);
                          }}
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <span className="text-secondary font-semibold mt-2 block">
                  Subtotal: $<span className="">{totalPrecio}</span>
                </span>

                <div className="card-actions flex-col gap-2 mt-2">
                  <Link
                    to="/cart"
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => setAbierto(false)}
                  >
                    Ver carrito
                  </Link>
                  <button
                    onClick={() => vaciarCarrito()}
                    className="btn btn-soft btn-error btn-sm w-full"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-gray-500">
                Tu carrito está vacío
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
