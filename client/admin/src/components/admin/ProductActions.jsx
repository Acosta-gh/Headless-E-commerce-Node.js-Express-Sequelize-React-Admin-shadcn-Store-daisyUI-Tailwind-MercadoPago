import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUploadForm from "./ImageUploadForm";

export default function ProductActions({
  product,
  handleEdit,
  handleDelete,
  createImagen,
  deleteImagen,
  imagen,
  uploadLoading,
  uploadError,
  setProducts, // recibido de ProductTable/ProductCardList
}) {
  const [openUpload, setOpenUpload] = useState(false);

  console.log("ProductActions render, product:", product);
  
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
        <Pencil size={16} />
      </Button>

      <Button size="sm" variant="ghost" onClick={() => setOpenUpload(true)}>
        <ImageIcon size={16} />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive" size="sm">
            Borrar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que deseas eliminar este producto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "<span className="font-semibold">{product.nombre}</span>" de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(product.id)}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir imagen para "{product.nombre}"</DialogTitle>
          </DialogHeader>

          <ImageUploadForm
            product={product}
            imagen={imagen}
            loading={uploadLoading}
            error={uploadError}
            initialItemId={String(product.id)}
            createImagen={createImagen}
            deleteImagen={deleteImagen}
            setProducts={setProducts}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}