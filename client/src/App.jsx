import { useState, useEffect } from "react";
import { getAllItems } from "./services/itemService.js";
import CategoryFilter from "./components/App/CategoryFilter";
import SearchBar from "./components/App/SearchBar";
import ItemGrid from "./components/App/ItemGrid";
import Loading from "./components/Ui/Loading.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");

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

  // Sacar los nombres únicos de categoría
  const categoriasUnicas = [
    ...new Set(
      items
        .map(item => item.categoria?.nombre)
        .filter(nombre => nombre)
    )
  ];

  // Filtrar items según búsqueda y categoría
  const itemsFiltrados = items.filter(item => {
    const coincideCategoria = selectedCategoria ? item.categoria?.nombre === selectedCategoria : true;
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(search.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  if (loading) return <Loading />

  return (
    <div className="mx-auto">
      <h1 className="text-2xl text-gray-900 font-semibold p-4 pb-0">Elige tu comida <span className="text-red-900">favorita</span></h1>
      <SearchBar search={search} setSearch={setSearch}/>
      <div className="mb-8">
        <CategoryFilter
          categorias={categoriasUnicas}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
        />
      </div>
      <ItemGrid items={itemsFiltrados} />
    </div>
  );
}

export default App;