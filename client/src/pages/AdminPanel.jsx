import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, updateItem, getAllItems } from '../services/itemService.js';
import { useAuth } from '../context/AuthContext.jsx';

function AdminPanel() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', categoria: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
  });

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = () => {
    getAllItems()
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

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
      nombre: '', descripcion: '', precio: '', categoria: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = item => {
    setEditingItem(item);
    setForm({
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: item.precio,
      categoria: item.categoria,
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
      nombre: '', descripcion: '', precio: '', categoria: '', imagenUrl: '', stock: '', unidad: '', destacado: false, disponible: true
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Editar' : 'Crear'} Item</h2>
      <form onSubmit={handleSubmit} className="mb-8 grid gap-2">
        <input name="nombre" value={form.nombre} onChange={handleInputChange} placeholder="Nombre" required className="border p-2 rounded"/>
        <input name="descripcion" value={form.descripcion} onChange={handleInputChange} placeholder="Descripción" className="border p-2 rounded"/>
        <input name="precio" value={form.precio} onChange={handleInputChange} placeholder="Precio" type="number" required className="border p-2 rounded"/>
        <input name="categoria" value={form.categoria} onChange={handleInputChange} placeholder="Categoría" className="border p-2 rounded"/>
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="border-t">
              <td>{it.nombre}</td>
              <td>${it.precio}</td>
              <td>{it.stock}</td>
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