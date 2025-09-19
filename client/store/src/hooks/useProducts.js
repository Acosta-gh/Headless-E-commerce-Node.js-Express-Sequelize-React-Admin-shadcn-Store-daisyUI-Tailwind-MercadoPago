import { useState, useEffect } from "react";
import productsService from "@/services/productsService";
import categoriesService from "@/services/categoriesService";
import { useAlert } from "@/context/AlertContext";

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

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const { showAlert } = useAlert();

  // Cargar productos al montar
  useEffect(() => {
    setLoading(true);
    productsService
      .getAll()
      .then((res) => setProducts(res))
      .catch(() => setError("Error al cargar productos"))
      .finally(() => setLoading(false));
  }, []);

  // Cargar categorías usando el service
  useEffect(() => {
    categoriesService
      .getAll()
      .then((cats) => setCategories(cats))
      .catch(() => setError("Error al cargar categorías"));
  }, []);

  // Maneja cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        imagenFile: files[0] || null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Guardar o editar producto
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      const fd = new FormData();
      fd.append("nombre", form.nombre);
      fd.append("descripcion", form.descripcion);
      fd.append("color", form.color || "");
      fd.append("tamano", form.tamano || "");
      fd.append("precio", parseFloat(form.precio));
      fd.append("stock", form.stock || "");
      if (form.categoriaId) fd.append("categoriaId", form.categoriaId);
      if (form.imagenFile) fd.append("image", form.imagenFile);

      let savedProduct;
      if (editing) {
        savedProduct = await productsService.updateProduct(editing.id, fd);
      } else {
        savedProduct = await productsService.createProduct(fd);
      }
      // volver a cargar los productos
      const updatedProducts = await productsService.getAll();
      setProducts(updatedProducts);

      resetForm();
      setOpen(false);
    } catch (err) {
      setError(err.message || "Error al guardar producto");
      showAlert(err.message || "Error al guardar producto", "error");
      console.log("Error detalle:", err);
    } finally {
      setLoading(false);
    }
  };

  // Editar producto (cargar datos al form)
  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      color: product.color || "",
      tamano: product.tamano || "",
      precio: product.precio || "",
      stock: product.stock || "",
      categoriaId: product.categoriaId || "",
      imagenFile: null,
      imagenUrl: product.imagenUrl || "",
    });
    setOpen(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await productsService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Error al eliminar producto");
      showAlert(err.message || "Error al eliminar producto", "error");
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setEditing(null);
    setForm(initialForm);
  };

  return {
    products,
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
    categories,
    setForm,
    setEditing,
  };
}
