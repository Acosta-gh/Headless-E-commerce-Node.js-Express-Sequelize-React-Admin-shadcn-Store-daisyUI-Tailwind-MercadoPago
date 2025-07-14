import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, updateItem, getAllItems } from '../services/itemService.js';
import { createCategoria, deleteCategoria, updateCategoria, getAllCategorias } from '../services/categoriaService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { uploadImage, deleteImage } from '../services/uploadService.js';
import { Fade } from 'react-awesome-reveal';
import { PlusCircle, Trash2, Edit, ImagePlus, Save, X, Tag, ShoppingBag, CheckCircle, Package, Star } from 'lucide-react';
import Loading from '../components/Ui/Loading.jsx';

function AdminPanel() {
  const { token, isAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    getAllItems()
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
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

  if (loading) return <Loading />;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-red-900 text-center">Panel de Administración</h1>

      <Fade duration={500} triggerOnce>
        <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-100 p-4 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <Tag size={20} />
              Gestión de Categorías
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleCatSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  name="nombre"
                  value={catForm.nombre}
                  onChange={handleCatInputChange}
                  placeholder="Nombre de la categoría"
                  required
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 pl-4"
                />
              </div>
              <button 
                type="submit" 
                className="bg-red-900 text-white px-6 py-3 rounded-full hover:bg-red-800 transition flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Crear Categoría
              </button>
            </form>

            <h3 className="text-lg font-semibold mb-3 text-red-800">Categorías Existentes</h3>
            <div className="overflow-auto rounded-xl border border-red-200 mb-4">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-red-100 text-red-900">
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-center text-red-700">No hay categorías</td>
                    </tr>
                  ) : (
                    categorias.map(cat => (
                      <tr key={cat.id} className="border-t border-red-100 hover:bg-red-50 transition-colors">
                        <td className="px-4 py-3">
                          {editingCategoria && editingCategoria.id === cat.id ? (
                            <form onSubmit={handleCatEditSubmit} className="flex gap-2 flex-col sm:flex-row items-center">
                              <div className="relative flex-1 w-full">
                                <input
                                  name="nombre"
                                  value={catEditForm.nombre}
                                  onChange={handleCatEditInputChange}
                                  required
                                  className="w-full border border-red-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 pl-4"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  type="submit" 
                                  className="bg-green-700 text-white px-3 py-1 rounded-full hover:bg-green-800 transition flex items-center gap-1"
                                >
                                  <Save size={16} />
                                  Guardar
                                </button>
                                <button 
                                  type="button" 
                                  onClick={handleCancelEditCategoria} 
                                  className="bg-gray-400 text-white px-3 py-1 rounded-full hover:bg-gray-500 transition flex items-center gap-1"
                                >
                                  <X size={16} />
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : (
                            <span className="font-medium text-red-900">{cat.nombre}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!editingCategoria || editingCategoria.id !== cat.id ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleEditCategoria(cat)} 
                                className="text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1"
                              >
                                <Edit size={16} />
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteCategoria(cat.id)} 
                                className="text-red-700 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1"
                              >
                                <Trash2 size={16} />
                                Eliminar
                              </button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-100 p-4 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <ShoppingBag size={20} />
              {editingItem ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-red-800 mb-1">Nombre del producto</label>
                <input 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Nombre del producto" 
                  required 
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-red-800 mb-1">Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={handleInputChange} 
                  placeholder="Descripción del producto" 
                  rows="3"
                  className="w-full border border-red-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">Precio</label>
                <input 
                  name="precio" 
                  value={form.precio} 
                  onChange={handleInputChange} 
                  placeholder="Precio" 
                  type="number" 
                  step="0.01"
                  required 
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">Categoría</label>
                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">Stock</label>
                <input 
                  name="stock" 
                  value={form.stock} 
                  onChange={handleInputChange} 
                  placeholder="Cantidad disponible" 
                  type="number" 
                  required 
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">Unidad</label>
                <input 
                  name="unidad" 
                  value={form.unidad} 
                  onChange={handleInputChange} 
                  placeholder="Unidad (ej: kg, unidad)" 
                  className="w-full border border-red-200 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-red-800 mb-1">Imagen del producto</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full border border-red-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 file:cursor-pointer"
                    />
                    {uploading && (
                      <div className="mt-2 flex items-center text-red-700">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Subiendo imagen...</span>
                      </div>
                    )}
                  </div>
                  
                  {(imagePreview || form.imagenUrl) && (
                    <div className="w-32 h-32 border border-red-200 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                      <img 
                        src={imagePreview || form.imagenUrl} 
                        alt="Vista previa" 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    name="destacado" 
                    type="checkbox" 
                    checked={form.destacado} 
                    onChange={handleInputChange} 
                    className="w-4 h-4 accent-red-700"
                  />
                  <span className="text-red-800 flex items-center gap-1">
                    <Star size={16} className="text-amber-500" />
                    Destacado
                  </span>
                </label>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    name="disponible" 
                    type="checkbox" 
                    checked={form.disponible} 
                    onChange={handleInputChange} 
                    className="w-4 h-4 accent-red-700"
                  />
                  <span className="text-red-800 flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    Disponible
                  </span>
                </label>
              </div>
              
              <div className="md:col-span-2 flex flex-wrap gap-3 mt-4">
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className={`bg-red-900 text-white px-6 py-3 rounded-full hover:bg-red-800 transition flex items-center gap-2 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {editingItem ? (
                    <>
                      <Save size={18} />
                      Actualizar Producto
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Crear Producto
                    </>
                  )}
                </button>
                {editingItem && (
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="bg-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-red-100 p-4 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <Package size={20} />
              Productos Existentes
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto rounded-xl border border-red-200">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-red-100 text-red-900">
                    <th className="px-4 py-3 text-left font-semibold">Producto</th>
                    <th className="px-4 py-3 text-left font-semibold">Precio</th>
                    <th className="px-4 py-3 text-center font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-center font-semibold">Estado</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-3 text-center text-red-700">No hay productos</td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`${index % 2 === 0 ? "bg-white" : "bg-red-50"} hover:bg-red-100 transition-colors border-t border-red-100`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.imagenUrl && (
                              <img 
                                src={item.imagenUrl} 
                                alt={item.nombre} 
                                className="w-10 h-10 object-cover rounded-md border border-red-100"
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-red-900">{item.nombre}</span>
                              {item.destacado && (
                                <Star size={16} className="text-amber-500" fill="currentColor" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">
                            ${parseFloat(item.precio).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-red-800">{item.stock}</td>
                        <td className="px-4 py-3">
                          <span className="bg-red-100 text-red-900 px-2 py-1 rounded-lg text-sm">
                            {item.categoria?.nombre || 'Sin categoría'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.disponible ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              <CheckCircle size={14} />
                              Disponible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                              <X size={14} />
                              No disponible
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleEdit(item)} 
                              className="text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1"
                            >
                              <Edit size={16} />
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)} 
                              className="text-red-700 hover:bg-red-50 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
}

export default AdminPanel;