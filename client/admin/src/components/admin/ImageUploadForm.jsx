import React, { useState, useEffect } from "react";

export default function ImageUploadForm({
  product,
  createImagen,
  deleteImagen,
  imagen,
  loading,
  error,
  initialItemId = "",
  onSuccess = () => {},
  setProducts, 
}) {
  const [file, setFile] = useState(null);
  const [itemId, setItemId] = useState(initialItemId);

  useEffect(() => {
    setItemId(initialItemId || "");
  }, [initialItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !itemId) return;

    if (typeof createImagen !== "function") {
      console.error(
        "createImagen no es una función. Revisa que la prop se pase correctamente desde el padre."
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("itemId", itemId);

    try {
      const newImage = await createImagen(formData);
      setFile(null);

      if (setProducts && newImage) {
        const parsedItemId = typeof newImage.itemId !== "undefined" ? newImage.itemId : itemId;
        const itemIdNum = isNaN(Number(parsedItemId)) ? parsedItemId : Number(parsedItemId);

        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            (p.id === itemIdNum || String(p.id) === String(itemIdNum))
              ? {
                  ...p,
                  imagenes: Array.isArray(p.imagenes) ? [...p.imagenes, newImage] : [newImage],
                }
              : p
          )
        );
      }

      onSuccess();
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageId) return;
    if (typeof deleteImagen !== "function") {
      console.error("deleteImagen no es una función. Revisa que la prop se pase correctamente desde el padre.");
      return;
    }
    try {
      await deleteImagen(imageId);
      onSuccess();

      if (setProducts) {
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.id === product.id
              ? {
                  ...prod,
                  imagenes: prod.imagenes ? prod.imagenes.filter((img) => img.id !== imageId) : [],
                }
              : prod
          )
        );
      }
    } catch (err) {
      console.error("Error eliminando imagen:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <div>
          <label className="block text-sm">Archivo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm">Producto (ID)</label>
          <input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !file || !itemId}
            className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-60"
          >
            Subir Imagen
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {imagen && imagen.url && (
          <img
            src={imagen.url}
            alt="subida"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}

        {file && (
          <div className="mt-2">
            <p className="text-sm">Preview:</p>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="mt-1 w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </form>
      {product?.imagenes?.length > 0 && (
        <ul>
          {product.imagenes.map((img) => (
            <li key={img.id} className="flex items-center gap-2">
              <img
                src={img.url}
                alt={`Imagen ${img.id}`}
                style={{ width: "100px" }}
              />
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}