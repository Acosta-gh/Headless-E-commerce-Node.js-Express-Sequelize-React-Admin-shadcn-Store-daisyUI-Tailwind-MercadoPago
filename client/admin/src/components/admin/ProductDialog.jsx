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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label>Nombre</Label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Camiseta básica"
            />
          </div>

          <div className="space-y-1">
            <Label>Descripción</Label>
            <Textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Color</Label>
              <Input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Ej: Blanco"
              />
            </div>
            <div className="space-y-1">
              <Label>Tamaño</Label>
              <Input
                name="tamano"
                value={form.tamano}
                onChange={handleChange}
                placeholder="Ej: M"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Precio</Label>
              <Input
                name="precio"
                type="number"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 19.99"
              />
            </div>
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej: 150"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Categoría</Label>
            <Select
              value={form.categoriaId || ""}
              onValueChange={(value) =>
                handleChange({ target: { name: "categoriaId", value } })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione categoría..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {catLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Cargando categorías...
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Imagen Principal</Label>
            <Input
              type="file"
              name="imagenFile"
              accept="image/*"
              onChange={handleChange}
            />
            {(form.imagenFile || form.imagenUrl) && (
              <div className="mt-2 w-32 h-32 rounded border border-gray-200 overflow-hidden">
                <img
                  src={
                    form.imagenFile
                      ? URL.createObjectURL(form.imagenFile)
                      : form.imagenUrl
                  }
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave} className="w-full">
            {editing ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
