import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductDialog({
  open,
  setOpen,
  editing,
  form,
  handleChange,
  handleSave,
  categories,
  catLoading,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Camiseta básica"
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Ej: Blanco"
            />
          </div>
          <div>
            <Label>Tamaño</Label>
            <Input
              name="tamano"
              value={form.tamano}
              onChange={handleChange}
              placeholder="Ej: M"
            />
          </div>
          <div>
            <Label>Precio</Label>
            <Input
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 19.99"
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Ej: 150"
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Seleccione categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {catLoading && (
              <div className="text-sm text-gray-500">Cargando categorías...</div>
            )}
          </div>
          <div>
            <Label>Imagen</Label>
            <Input
              type="file"
              name="imagenFile"
              accept="image/*"
              onChange={handleChange}
            />
            {form.imagenFile && (
              <img
                src={URL.createObjectURL(form.imagenFile)}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
            {!form.imagenFile && form.imagenUrl && (
              <img
                src={form.imagenUrl}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>
            {editing ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}