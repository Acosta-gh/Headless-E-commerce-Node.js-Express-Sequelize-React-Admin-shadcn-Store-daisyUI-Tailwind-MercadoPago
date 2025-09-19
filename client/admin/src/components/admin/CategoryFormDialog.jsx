import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryFormDialog({
  open,
  setOpen,
  editing,
  form,
  handleChange,
  handleSave,
  saving,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Ropa"
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la categoría"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Ej: #FF0000"
              type="color"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {editing ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}