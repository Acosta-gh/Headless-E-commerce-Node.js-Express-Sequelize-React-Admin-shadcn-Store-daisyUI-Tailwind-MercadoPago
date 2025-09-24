import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useProductById from "@/hooks/useProductById";
import { useCart } from "@/context/CartContext";

function Product() {
  const { id } = useParams();

  const { product, loading, error } = useProductById(id);
  const { cart, agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false); // para animación de agregado
  const [active, setActive] = useState(0);
  const [cantidad, setCantidad] = useState(1); // Siempre inicia en 1

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <span>{error}</span>
      </div>
    );

  if (!product)
    return (
      <div className="alert alert-warning shadow-lg max-w-md mx-auto mt-8">
        <span>No se encontró el producto.</span>
      </div>
    );

  const images = [
    ...(product?.imagenUrl ? [product.imagenUrl] : []),
    ...(product?.imagenes?.map((img) => img.url).filter((url) => url && url !== product?.imagenUrl) || []),
  ];

  const handleAgregarCantidad = () => {
    if (cantidad < product.stock) setCantidad((prev) => prev + 1);
  };

  const handleQuitarCantidad = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  const handleAgregarAlCarrito = () => {
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
    agregarAlCarrito(product, cantidad);
    setCantidad(1); // Reinicia el contador después de agregar
  };

  return (
    <div className="w-full max-w-xl mx-auto my-24 bg-base-100 border-base-200 rounded-xl shadow-lg">
      <div className="card-body flex flex-col items-center gap-4">
        {/* Título y categoría */}
        <div className="text-center w-full">
          <h2 className="text-3xl font-bold">{product.nombre}</h2>
          <p className="text-sm text-primary font-semibold mt-1">{product.categoria?.nombre}</p>
        </div>

        {/* Imagen principal */}
        <div className="aspect-square w-full flex items-center justify-center rounded-xl bg-base-200 p-2">
          <img
            src={images[active]}
            onError={(e) => (e.target.src = "/placeholder.png")}
            className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
            alt={product.nombre}
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 justify-center w-full">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`border-2 p-1 rounded-lg transition-all duration-200 hover:border-primary/70 ${
                active === index ? "border-primary" : "border-base-200"
              }`}
              style={{ width: 48, height: 48 }}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={img}
                alt={`img-${index}`}
                className={`object-cover w-full h-full rounded-md ${
                  active === index ? "ring ring-primary ring-offset-2" : ""
                }`}
              />
            </button>
          ))}
        </div>

        {/* Precio y disponibilidad */}
        <div className="flex items-center justify-between w-full mt-4 mb-2">
          <span className="text-2xl font-extrabold text-primary">
            {product.precio?.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
          </span>
          <span className={`badge text-base ${product.disponible ? "badge-success" : "badge-error"}`}>
            {product.disponible ? "Disponible" : "No disponible"}
          </span>
        </div>

        {/* Selector de cantidad y botón agregar */}
        <div className="flex items-center gap-2 w-full justify-center mt-2">
          <div className="flex items-center border rounded-lg px-2 py-1 bg-base-200">
            <button
              type="button"
              className="btn btn-xs btn-circle btn-ghost"
              onClick={handleQuitarCantidad}
              disabled={cantidad <= 1}
            >
              -
            </button>
            <span className="mx-2 min-w-[2ch] text-center select-none">{cantidad}</span>
            <button
              type="button"
              className="btn btn-xs btn-circle btn-ghost"
              onClick={handleAgregarCantidad}
              disabled={cantidad >= product.stock}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-primary btn-wide text-base"
            disabled={!product.disponible || product.stock < 1 || cart.find((item) => item.id === product.id)?.cantidad >= product.stock}
            onClick={agregado ? null : handleAgregarAlCarrito}
          >
            {agregado ? "¡Agregado!" : "Agregar al carrito"}
          </button>
        </div>

        {/* Descripción */}
        {product.descripcion && (
          <div className="w-full">
            <p className="text-gray-500 text-base text-center mb-2">{product.descripcion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
