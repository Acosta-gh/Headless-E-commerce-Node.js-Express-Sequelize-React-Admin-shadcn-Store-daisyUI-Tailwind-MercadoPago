import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";

function ProductsView({ products }) {
  const { cart, agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState({}); // objeto con ids de productos agregados

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
            <Link to={`/product/${prod.id}`}>
              <ProductCard
                prod={prod}
                // Solo deshabilita cuando está agotado y NO se está mostrando el agregado
                disabled={agotado && !agregado[prod.id]}
                agotado={agotado}
                showAgregado={!!agregado[prod.id]}
                onAgregar={() => handleAgregar(prod)}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ProductCard({ prod, agotado, showAgregado, disabled, onAgregar }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img src={prod.imagenUrl} alt={prod.nombre} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {prod.nombre}
          {prod.destacado && (
            <div className="badge badge-secondary ml-2">Destacado</div>
          )}
        </h2>
        <div className="text-2xl font-bold text-success mb-2">
          ${prod.precio}
        </div>
        <p>{prod.descripcion}</p>
        <div className="card-actions justify-between mt-4">
          <div className="badge badge-outline">{prod.categoria.nombre}</div>
          <button
            className="btn btn-success relative overflow-hidden flex items-center justify-center gap-2"
            disabled={disabled}
            onClick={() => {
              if (agotado || showAgregado) return;
              onAgregar();
            }}
          >
            {/* Texto animado */}
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
