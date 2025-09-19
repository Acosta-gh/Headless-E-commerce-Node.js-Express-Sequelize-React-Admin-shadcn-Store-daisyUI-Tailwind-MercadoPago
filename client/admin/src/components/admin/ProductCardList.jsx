import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductActions from "./ProductActions.jsx";

export default function ProductCardList({ products, categories, handleEdit, handleDelete, createImagen, deleteImagen, setProducts }) {
  return (
    <>
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            {product.imagenUrl && (
              <Avatar>
                <AvatarImage src={product.imagenUrl} alt={product.nombre} />
                <AvatarFallback>
                  {product.nombre ? product.nombre[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <div className="font-semibold">{product.nombre}</div>
              <div className="text-xs text-gray-500">
                {categories.find((cat) => cat.id === product.categoriaId)?.nombre || "Sin categoría"}
              </div>
            </div>
          </div>
          <div className="text-sm">{product.descripcion}</div>
          <div className="text-sm flex gap-2 flex-wrap">
            <span>Color: {product.color}</span>
            <span>Tamaño: {product.tamano}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-700">
              Precio: <span className="font-medium">${product.precio}</span><br />
              Stock: <span className="font-medium">{product.stock}</span>
            </div>
            <div className="flex gap-2">
              <ProductActions
                product={product}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                createImagen={createImagen}
                deleteImagen={deleteImagen}
                setProducts={setProducts}
                compact
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}