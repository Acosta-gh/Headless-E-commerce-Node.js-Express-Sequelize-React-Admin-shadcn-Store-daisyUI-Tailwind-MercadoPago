import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductActions from "./ProductActions";

export default function ProductTable({
  products,
  categories,
  handleEdit,
  handleDelete,
  createImagen,
  deleteImagen,
  imagen,
  uploadLoading,
  uploadError,
  setProducts,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="hidden sm:table-cell">Color</TableHead>
            <TableHead className="hidden sm:table-cell">Tamaño</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="w-[120px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.imagenUrl && (
                  <Avatar>
                    <AvatarImage src={product.imagenUrl} alt={product.nombre} />
                    <AvatarFallback>
                      {product.nombre ? product.nombre[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </TableCell>
              <TableCell>{product.nombre}</TableCell>
              <TableCell
                className="
                  max-w-xs
                  overflow-hidden
                  whitespace-nowrap
                  text-ellipsis
                  sm:whitespace-normal
                  sm:text-clip
                  sm:max-w-sm
                "
                title={product.descripcion} 
              >
                {product.descripcion}
              </TableCell>
              <TableCell className="hidden sm:table-cell">{product.color}</TableCell>
              <TableCell className="hidden sm:table-cell">{product.tamano}</TableCell>
              <TableCell>${product.precio}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                {categories.find((cat) => cat.id === product.categoriaId)
                  ?.nombre || "Sin categoría"}
              </TableCell>
              <TableCell className="flex gap-2">
                <ProductActions
                  product={product}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  createImagen={createImagen}
                  deleteImagen={deleteImagen}
                  imagen={imagen}
                  uploadLoading={uploadLoading}
                  uploadError={uploadError}
                  setProducts={setProducts}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}