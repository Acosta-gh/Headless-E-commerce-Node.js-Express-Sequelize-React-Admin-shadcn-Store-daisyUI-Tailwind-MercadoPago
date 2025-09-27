import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useProductById from "@/hooks/useProductById";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { Fade } from "react-awesome-reveal";

function Product() {
  const { id } = useParams();

  const { product, loading, error } = useProductById(id);
  console.log("Producto cargado:", product);

  const { cart, agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false); // para animación de agregado
  const [active, setActive] = useState(0);
  const [cantidad, setCantidad] = useState(1); // Siempre inicia en 1

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-gray-500">{error}</h1>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <h1 className="text-gray-500">No se encontró el producto.</h1>
      </div>
    );

  const images = [
    ...(product?.imagenUrl ? [product.imagenUrl] : []),
    ...(product?.imagenes
      ?.map((img) => img.url)
      .filter((url) => url && url !== product?.imagenUrl) || []),
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
    <div className="p-4 min-h-[80vh] bg-base-200">
      <Fade duration={500} >
        <div className="w-full max-w-xl card mx-auto my-24 bg-base-100 border-base-200 rounded-xl shadow-lg">
          <div className="card-body flex flex-col items-center gap-4">
            {/* Título y categoría */}
            <div className="text-center w-full">
              <h2 className="text-3xl font-bold">{product.nombre}</h2>
              <p className="text-sm  font-semibold mt-1">
                {product.categoria?.nombre}
              </p>
            </div>

            {/* Imagen principal */}
            <div className="aspect-square w-full flex items-center justify-center rounded-xl h-124 bg-base-200 p-2">
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
            <div className="flex items-center justify-center w-full mt-4 mb-2">
              <span className="text-2xl font-extrabold text-primary mr-4">
                {product.precio?.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>
              {/*
          <span className={`badge text-base ${product.disponible ? "badge-primary" : "badge-error"}`}>
            {product.disponible ? "Disponible" : "No disponible"}
          </span>
           */}
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
                <span className="mx-2 min-w-[2ch] text-center select-none">
                  {cantidad}
                </span>
                <button
                  type="button"
                  className="btn btn-xs btn-circle btn-ghost"
                  onClick={handleAgregarCantidad}
                  disabled={cantidad >= product.stock}
                >
                  +
                </button>
              </div>

              {/* BOTÓN CON ANIMACIÓN */}
              <button
                className="btn btn-primary btn-wide text-base relative overflow-hidden flex items-center justify-center gap-2"
                disabled={
                  !product.disponible ||
                  product.stock < 1 ||
                  cart.find((item) => item.id === product.id)?.cantidad >=
                    product.stock
                }
                onClick={agregado ? null : handleAgregarAlCarrito}
              >
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    agregado
                      ? "opacity-100 scale-100 cursor-default"
                      : "opacity-0 scale-90 pointer-events-none"
                  }`}
                  aria-live="polite"
                >
                  <Check className="w-5 h-5 mr-1" />
                  ¡Agregado!
                </span>
                <span
                  className={`flex items-center gap-2 transition-opacity duration-500 ${
                    agregado ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al carrito
                </span>
              </button>
            </div>

            {/* Descripción */}
            {product.descripcion && (
              <div className="w-full mt-4">
                <p className="text-gray-700 text-base text-left whitespace-pre-line break-words">
                  {product.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      </Fade>
    </div>
  );
}

export default Product;
