import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";

function ProductsView({ products }) {
  const { cart, agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState({});

  const handleAgregar = (prod) => {
    agregarAlCarrito(prod);
    setAgregado((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(
      () => setAgregado((prev) => ({ ...prev, [prod.id]: false })),
      1500
    );
  };

  return (
    <ul className="flex flex-wrap gap-6">
      {products.map((prod) => {
        const enCarrito = cart.find((item) => item.id === prod.id);
        const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
        const agotado = cantidadEnCarrito >= prod.stock;

        return (
          <li key={prod.id}>
            <ProductCard
              prod={prod}
              disabled={agotado && !agregado[prod.id]}
              agotado={agotado}
              showAgregado={!!agregado[prod.id]}
              onAgregar={() => handleAgregar(prod)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ProductCard({ prod, agotado, showAgregado, disabled, onAgregar }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      {/* Link que envuelve imagen y contenido */}
      <Link to={`/product/${prod.id}`}>
        <figure className="aspect-square w-full flex items-center justify-center rounded-t-xl  p-2">
          <img
            src={prod.imagenUrl}
            alt={prod.nombre}
            className="
              object-contain 
              w-full 
              h-full
              max-h-120 
              max-w-120 
              transition-transform
              duration-300
              group-hover:scale-105
              rounded-lg
            "
            style={{ minHeight: "120px", minWidth: "120px" }}
            loading="lazy"
          />
        </figure>
        <div className="card-body pb-0">
          <h2 className="card-title h-12 overflow-hidden mb-1">
            {prod.nombre}
            {prod.destacado && (
              <div className="badge badge-secondary ml-2">Destacado</div>
            )}
          </h2>
          <div className="text-2xl font-bold text-primary mb-2">
            {prod.precio.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            })}
          </div>
        </div>
      </Link>
      {/* Botón fuera del Link */}
      <div className="card-body pt-0">
        <div className="card-actions justify-between mt-4">
          <div className="badge badge-outline">{prod.categoria.nombre}</div>
          <button
            className="btn btn-primary relative overflow-hidden flex items-center justify-center gap-2"
            disabled={disabled}
            onClick={() => {
              if (agotado || showAgregado) return;
              onAgregar();
            }}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                showAgregado
                  ? "opacity-100 scale-100 cursor-default"
                  : "opacity-0 scale-90 cursor-pointer"
              }`}
              aria-live="polite"
            >
              <>
                <Check className="w-5 h-5 mr-1" />
                Agregado
              </>
            </span>
            <span
              className={`flex items-center gap-2 transition-opacity duration-500 ${
                showAgregado ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {!disabled && <ShoppingCart className="w-4 h-4" />}
              {disabled ? "Sin stock" : "Añadir al carrito"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
