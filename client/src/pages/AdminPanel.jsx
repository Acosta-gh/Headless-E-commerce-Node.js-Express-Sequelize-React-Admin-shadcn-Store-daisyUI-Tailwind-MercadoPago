import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, updateItem, getAllItems } from '../services/itemService.js';
import { createCategoria, deleteCategoria, updateCategoria, getAllCategorias } from '../services/categoriaService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { uploadImage, deleteImage } from '../services/uploadService.js';

function AdminPanel() {
  const { token, isAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
  });

  const [catForm, setCatForm] = useState({ nombre: '' });
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [catEditForm, setCatEditForm] = useState({ nombre: '' });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategorias();
  }, [isAdmin]);

  const fetchItems = () => {
    getAllItems()
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  };

  const fetchCategorias = () => {
    getAllCategorias()
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCatInputChange = e => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };

  const handleCatEditInputChange = e => {
    setCatEditForm({ ...catEditForm, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);

    let imagenUrl = form.imagenUrl;
    let imagenAnterior = null;

    if (selectedImageFile) {
      if (editingItem && editingItem.imagenUrl) {
        imagenAnterior = editingItem.imagenUrl;
      }
      const formData = new FormData();
      formData.append('image', selectedImageFile);

      try {
        const res = await uploadImage(formData, token);
        imagenUrl = res.data.url;
      } catch (error) {
        alert("Error al subir la imagen");
        setUploading(false);
        return;
      }
    }

    try {
      const itemData = {
        ...form,
        imagenUrl
      };
      if (editingItem) {
        await updateItem(editingItem.id, itemData, token);
        if (imagenAnterior && imagenAnterior !== imagenUrl) {
          await deleteImage(imagenAnterior, token);
        }
      } else {
        await createItem(itemData, token);
      }
    } catch (error) {
      alert("Error en la operación. ¿Tienes permisos?");
      console.error("Error al crear/actualizar item:", error);
    }

    setForm({
      nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
    setImagePreview('');
    setSelectedImageFile(null);
    setUploading(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleCatSubmit = async e => {
    e.preventDefault();
    try {
      await createCategoria(catForm, token);
    } catch (error) {
      alert("No se pudo crear la categoría.");
    }
    setCatForm({ nombre: '' });
    fetchCategorias();
  };

  const handleEditCategoria = (cat) => {
    setEditingCategoria(cat);
    setCatEditForm({ nombre: cat.nombre });
  };

  const handleCatEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategoria(editingCategoria.id, catEditForm, token);
    } catch (error) {
      alert("No se pudo actualizar la categoría.");
    }
    setEditingCategoria(null);
    setCatEditForm({ nombre: '' });
    fetchCategorias();
  };

  const handleCancelEditCategoria = () => {
    setEditingCategoria(null);
    setCatEditForm({ nombre: '' });
  };

  const handleDeleteCategoria = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteCategoria(id, token);
      } catch (error) {
        alert("Error al eliminar la categoría. Puede que tenga items asociados o no tengas permisos.");
      }
      fetchCategorias();
      fetchItems();
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: item.precio,
      categoriaId: item.categoriaId,
      imagenUrl: item.imagenUrl,
      stock: item.stock,
      unidad: item.unidad,
      destacado: item.destacado,
      disponible: item.disponible
    });
    setImagePreview('');
    setSelectedImageFile(null);
  };

  const handleDelete = async id => {
    const item = items.find(i => i.id === id);
    if (window.confirm('¿Eliminar este item?')) {
      try {
        await deleteItem(id, token);
        if (item && item.imagenUrl) {
          await deleteImage(item.imagenUrl, token);
        }
      } catch (error) {
        alert("Error al eliminar. ¿Tienes permisos?");
        console.error("Error al eliminar item:", error);
      }
      fetchItems();
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({
      nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
    setImagePreview('');
    setSelectedImageFile(null);
  };

  return (
    <div className="p-2 sm:p-6 max-w-2xl mx-auto rounded-2xl shadow-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Formulario para categorías */}
      <h2 className="text-xl font-bold mb-2 text-gray-800">Crear Categoría</h2>
      <form onSubmit={handleCatSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          name="nombre"
          value={catForm.nombre}
          onChange={handleCatInputChange}
          placeholder="Nombre categoría"
          required
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200 flex-1"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
          Crear
        </button>
      </form>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Categorías Existentes</h2>
      <div className="overflow-auto mb-6 rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-2">Nombre</th>
              <th className="px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id} className="border-t border-gray-200">
                <td className="px-2 py-1">
                  {editingCategoria && editingCategoria.id === cat.id ? (
                    <form onSubmit={handleCatEditSubmit} className="flex gap-2 flex-col sm:flex-row">
                      <input
                        name="nombre"
                        value={catEditForm.nombre}
                        onChange={handleCatEditInputChange}
                        required
                        className="border border-gray-300 p-1 rounded focus:outline-none focus:ring focus:ring-blue-200 flex-1"
                      />
                      <div className="flex gap-1 mt-2 sm:mt-0">
                        <button type="submit" className="text-green-600 font-bold">Guardar</button>
                        <button type="button" onClick={handleCancelEditCategoria} className="text-gray-600 font-bold">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    cat.nombre
                  )}
                </td>
                <td className="px-2 py-1">
                  {!editingCategoria || editingCategoria.id !== cat.id ? (
                    <div className="flex gap-1 flex-col sm:flex-row">
                      <button onClick={() => handleEditCategoria(cat)} className="text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleDeleteCategoria(cat.id)} className="text-red-600 hover:underline">Eliminar</button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Formulario para items */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingItem ? 'Editar' : 'Crear'} Item</h2>
      <form onSubmit={handleSubmit} className="mb-8 grid gap-2">
        <input name="nombre" value={form.nombre} onChange={handleInputChange} placeholder="Nombre" required className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200" />
        <input name="descripcion" value={form.descripcion} onChange={handleInputChange} placeholder="Descripción" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200" />
        <input name="precio" value={form.precio} onChange={handleInputChange} placeholder="Precio" type="number" required className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200" />
        <select
          name="categoriaId"
          value={form.categoriaId}
          onChange={handleInputChange}
          required
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <div>
          <label className="block mb-1 text-gray-700">Subir Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          {uploading && <span className="text-gray-500 ml-2">Subiendo...</span>}
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="mt-2 max-h-24 rounded shadow-lg" />
          )}
          {form.imagenUrl && !imagePreview && (
            <img src={form.imagenUrl} alt="actual" className="mt-2 max-h-24 rounded shadow-lg" />
          )}
        </div>
        <input name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" type="number" required className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200" />
        <input name="unidad" value={form.unidad} onChange={handleInputChange} placeholder="Unidad" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-200" />
        <label className="flex items-center gap-2">
          <input name="destacado" type="checkbox" checked={form.destacado} onChange={handleInputChange} className="accent-blue-600" /> 
          <span className="text-gray-700">Destacado</span>
        </label>
        <label className="flex items-center gap-2">
          <input name="disponible" type="checkbox" checked={form.disponible} onChange={handleInputChange} className="accent-blue-600" /> 
          <span className="text-gray-700">Disponible</span>
        </label>
        <div className="flex gap-2 mt-2 flex-col sm:flex-row">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition w-full sm:w-auto">
            {editingItem ? 'Actualizar' : 'Crear'}
          </button>
          {editingItem && (
            <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition w-full sm:w-auto">
              Cancelar
            </button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Items Existentes</h2>
      <div className="overflow-auto rounded-lg border border-gray-200 mb-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-2">Nombre</th>
              <th className="px-2 py-2">Precio</th>
              <th className="px-2 py-2">Stock</th>
              <th className="px-2 py-2">Categoría</th>
              <th className="px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t border-gray-200">
                <td className="px-2 py-1">{it.nombre}</td>
                <td className="px-2 py-1">${it.precio}</td>
                <td className="px-2 py-1">{it.stock}</td>
                <td className="px-2 py-1">{it.categoria?.nombre || 'Sin categoría'}</td>
                <td className="px-2 py-1">
                  <div className="flex gap-1 flex-col sm:flex-row">
                    <button onClick={() => handleEdit(it)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(it.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;