import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Archivo</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <Input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
            hidden={!!initialItemId}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !file || !itemId}
          className="w-full"
        >
          Subir Imagen
        </Button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        
      </form>

      {product?.imagenes?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {product.imagenes.map((img) => (
            <Card key={img.id} className="flex flex-col items-center p-2">
              <img
                src={img.url}
                alt={`Imagen ${img.id}`}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteImage(img.id)}
              >
                Eliminar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
