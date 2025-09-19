import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import useCategories from "@/hooks/useCategories";
import categoriesService from "@/services/categoriesService";

import CategoryTable from "@/components/admin/CategoryTable";
import CategoryCards from "@/components/admin/CategoryCards";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";

const initialForm = {
  nombre: "",
  descripcion: "",
  color: "",
};

export default function Categories() {
  const { categories, loading, error } = useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await categoriesService.updateCategory(editing.id, form);
      } else {
        await categoriesService.createCategory(form);
      }
      setOpen(false);
      setEditing(null);
      setForm(initialForm);
      window.location.reload();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category) {
    setEditing(category);
    setForm({
      nombre: category.nombre || "",
      descripcion: category.descripcion || "",
      color: category.color || "",
    });
    setOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await categoriesService.deleteCategory(id);
      window.location.reload();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">Cargando...</div>
          ) : (
            <>
              <div className="hidden sm:block">
                <CategoryTable
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
              <div className="sm:hidden space-y-4">
                <CategoryCards
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </>
          )}
          <div className="flex justify-start mt-6">
            <Button
              onClick={() => {
                setOpen(true);
                setEditing(null);
                setForm(initialForm);
              }}
              className="flex gap-2"
            >
              <PlusCircle size={18} /> Nueva
            </Button>
          </div>
        </CardContent>
      </Card>
      <CategoryFormDialog
        open={open}
        setOpen={setOpen}
        editing={editing}
        form={form}
        handleChange={handleChange}
        handleSave={handleSave}
        saving={saving}
      />
    </div>
  );
}