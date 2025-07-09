import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "./services/itemService.js";

function App() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        setItems(response.data);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Items del Futuro 🚀</h1>
      {items.length === 0 ? (
        <p>No hay items disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <img
                src={item.imagenUrl}
                alt={item.nombre}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-1">{item.nombre}</h2>
              <p className="text-gray-500 mb-1">{item.descripcion}</p>
              <span className="text-lg font-bold text-blue-600">${item.precio}</span>
              <div className="mt-2 text-sm text-gray-400">
                {item.categoria} | Stock: {item.stock}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;