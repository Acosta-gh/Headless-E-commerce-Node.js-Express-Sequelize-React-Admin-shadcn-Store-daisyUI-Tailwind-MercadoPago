import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

import { PlusCircle } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import useImagen from "@/hooks/useImages";

import ProductTable from "@/components/admin/ProductTable";
import ProductCardList from "@/components/admin/ProductCardList";
import ProductDialog from "@/components/admin/ProductDialog";

const initialForm = {
  nombre: "",
  descripcion: "",
  color: "",
  tamano: "",
  precio: "",
  stock: "",
  categoriaId: "",
  imagenFile: null,
  imagenUrl: "",
};

export default function Products() {
  const {
    products,
    setProducts, 
    open,
    setOpen,
    editing,
    form,
    loading,
    error,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    setForm,
    setEditing,
  } = useProducts([]);
  const { categories, error: catError, loading: catLoading } = useCategories();

  const {
    imagen,
    createImagen,
    deleteImagen,
    loading: imagenLoading,
    error: imagenError,
  } = useImagen();

  return (
    <div className="p-2 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">Cargando...</div>
          ) : (
            <>
              <div className="hidden sm:block">
                <ProductTable
                  products={products}
                  categories={categories}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  createImagen={createImagen}
                  deleteImagen={deleteImagen}
                  imagen={imagen}
                  uploadLoading={imagenLoading}
                  uploadError={imagenError}
                  setProducts={setProducts} 
                />
              </div>

              <div className="sm:hidden space-y-4">
                <ProductCardList
                  products={products}
                  categories={categories}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  createImagen={createImagen}
                  deleteImagen={deleteImagen}
                  imagen={imagen}
                  uploadLoading={imagenLoading}
                  uploadError={imagenError}
                  setProducts={setProducts} 
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
            >
              <PlusCircle size={18} /> Nuevo
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={open}
        setOpen={setOpen}
        editing={editing}
        form={form}
        handleChange={handleChange}
        handleSave={handleSave}
        categories={categories}
        catLoading={catLoading}
      />

    </div>
  );
}