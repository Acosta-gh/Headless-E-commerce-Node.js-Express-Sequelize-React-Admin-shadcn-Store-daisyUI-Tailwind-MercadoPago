import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, updateItem, getAllItems } from '../services/itemService.js';
import { createCategoria, deleteCategoria, updateCategoria, getAllCategorias } from '../services/categoriaService.js';
import { useAuth } from '../context/AuthContext.jsx';

function AdminPanel() {
  const { token } = useAuth();

  // Estados para items y categorías
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Formulario de items
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
  });

  // Formulario de categorías
  const [catForm, setCatForm] = useState({ nombre: '' });

  // Edición de categoría
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [catEditForm, setCatEditForm] = useState({ nombre: '' });

  useEffect(() => {
    fetchItems();
    fetchCategorias();
  }, []);

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

  // Para input en el formulario de items
  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Para input en el formulario de categorías
  const handleCatInputChange = e => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };

  // Para input en la edición de categoría
  const handleCatEditInputChange = e => {
    setCatEditForm({ ...catEditForm, [e.target.name]: e.target.value });
  };

  // Crear o actualizar item
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(editingItem.id, form, token);
      } else {
        await createItem(form, token);
      }
    } catch (error) {
      alert("Error en la operación. ¿Tienes permisos?");
    }
    setForm({
      nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
    setEditingItem(null);
    fetchItems();
  };

  // Crear categoría
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

  // Editar categoría: muestra el form de edición inline
  const handleEditCategoria = (cat) => {
    setEditingCategoria(cat);
    setCatEditForm({ nombre: cat.nombre });
  };

  // Guardar edición de categoría
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

  // Cancelar edición de categoría
  const handleCancelEditCategoria = () => {
    setEditingCategoria(null);
    setCatEditForm({ nombre: '' });
  };

  // Eliminar categoría
  const handleDeleteCategoria = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteCategoria(id, token);
      } catch (error) {
        alert("Error al eliminar la categoría. Puede que tenga items asociados o no tengas permisos.");
      }
      fetchCategorias();
      fetchItems(); // refresca items por si alguno quedó sin categoría
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
  };

  const handleDelete = async id => {
    if (window.confirm('¿Eliminar este item?')) {
      try {
        await deleteItem(id, token);
      } catch (error) {
        alert("Error al eliminar. ¿Tienes permisos?");
      }
      fetchItems();
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({
      nombre: '', descripcion: '', precio: '', categoriaId: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Formulario para categorías */}
      <h2 className="text-xl font-bold mb-2">Crear Categoría</h2>
      <form onSubmit={handleCatSubmit} className="mb-6 flex gap-2">
        <input
          name="nombre"
          value={catForm.nombre}
          onChange={handleCatInputChange}
          placeholder="Nombre categoría"
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Categorías Existentes</h2>
      <table className="min-w-full table-auto mb-6 border">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id} className="border-t">
              <td>
                {editingCategoria && editingCategoria.id === cat.id ? (
                  <form onSubmit={handleCatEditSubmit} className="flex gap-2">
                    <input
                      name="nombre"
                      value={catEditForm.nombre}
                      onChange={handleCatEditInputChange}
                      required
                      className="border p-1 rounded"
                    />
                    <button type="submit" className="text-green-600 font-bold">Guardar</button>
                    <button type="button" onClick={handleCancelEditCategoria} className="text-gray-600 font-bold">Cancelar</button>
                  </form>
                ) : (
                  cat.nombre
                )}
              </td>
              <td>
                {!editingCategoria || editingCategoria.id !== cat.id ? (
                  <>
                    <button onClick={() => handleEditCategoria(cat)} className="text-blue-600 mr-2">Editar</button>
                    <button onClick={() => handleDeleteCategoria(cat.id)} className="text-red-600">Eliminar</button>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario para items */}
      <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Editar' : 'Crear'} Item</h2>
      <form onSubmit={handleSubmit} className="mb-8 grid gap-2">
        <input name="nombre" value={form.nombre} onChange={handleInputChange} placeholder="Nombre" required className="border p-2 rounded"/>
        <input name="descripcion" value={form.descripcion} onChange={handleInputChange} placeholder="Descripción" className="border p-2 rounded"/>
        <input name="precio" value={form.precio} onChange={handleInputChange} placeholder="Precio" type="number" required className="border p-2 rounded"/>
        <select
          name="categoriaId"
          value={form.categoriaId}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <input name="imagenUrl" value={form.imagenUrl} onChange={handleInputChange} placeholder="URL Imagen" className="border p-2 rounded"/>
        <input name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" type="number" required className="border p-2 rounded"/>
        <input name="unidad" value={form.unidad} onChange={handleInputChange} placeholder="Unidad" className="border p-2 rounded"/>
        <label>
          <input name="destacado" type="checkbox" checked={form.destacado} onChange={handleInputChange}/> Destacado
        </label>
        <label>
          <input name="disponible" type="checkbox" checked={form.disponible} onChange={handleInputChange}/> Disponible
        </label>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            {editingItem ? 'Actualizar' : 'Crear'}
          </button>
          {editingItem && (
            <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold mb-2">Items Existentes</h2>
      <table className="min-w-full table-auto mb-4 border">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="border-t">
              <td>{it.nombre}</td>
              <td>${it.precio}</td>
              <td>{it.stock}</td>
              <td>{it.categoria?.nombre || 'Sin categoría'}</td>
              <td>
                <button onClick={() => handleEdit(it)} className="text-blue-600 mr-2">Editar</button>
                <button onClick={() => handleDelete(it.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;