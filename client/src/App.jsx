import { useState, useEffect } from "react";
import { getAllItems } from "./services/itemService.js";
import CategoryFilter from "./components/App/CategoryFilter";
import SearchBar from "./components/App/SearchBar";
import ItemContainer from "./components/App/ItemContainer.jsx";
import Loading from "./components/Ui/Loading.jsx";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
// import { Star } from "lucide-react";
import ReactPaginate from "react-paginate";

function App() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [fadeKey, setFadeKey] = useState(0);

  // PAGINATION STATES
  const itemsPerPage = 6; 
  const [itemOffset, setItemOffset] = useState(0);

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

  // Actualiza el fadeKey cada vez que se cambia categoría o búsqueda
  useEffect(() => {
    setFadeKey(prev => prev + 1);
  }, [selectedCategoria, search]);

  // Resetear paginación cuando cambia el filtro o búsqueda
  useEffect(() => {
    setItemOffset(0);
  }, [selectedCategoria, search]);

  const categoriasUnicas = [
    ...new Set(
      items
        .map(item => item.categoria?.nombre)
        .filter(nombre => nombre)
    )
  ];

  const itemsFiltrados = items.filter(item => {
    const coincideCategoria = selectedCategoria ? item.categoria?.nombre === selectedCategoria : true;
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(search.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  const itemsDestacados = itemsFiltrados.filter(item => item.destacado);

  // PAGINATION LOGIC
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = itemsFiltrados.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(itemsFiltrados.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % itemsFiltrados.length;
    setItemOffset(newOffset);
  };

  if (loading) return <Loading />

  return (
    <div className="mx-auto">
      <h1 className="text-2xl text-gray-900 font-semibold p-4 pb-0">
        Elige tu comida <span className="text-red-900">favorita</span>
      </h1>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="mb-8">
        <CategoryFilter
          categorias={categoriasUnicas}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
        />
      </div>
      {itemsDestacados.length > 0 && (
        <div className="mb-4">
          <div className="pr-4 flex flex-row items-center justify-between ">
            <h3 className="flex items-center gap-2 p-4 text-lg">
              {/* <Star color="#9b0808" fill="#9b0808" size={20} className="inline-block align-middle relative bottom-[1.5px] left-[3px]" /> */}
              <span className="font-medium">Destacados</span>
            </h3>
            <Link to="/destacados" className="text-red-800 font-medium  ">
              Ver Todos
            </Link>
          </div>
          <Fade key={`fade-destacados-${fadeKey}`} triggerOnce={false} duration={600}>
            <ItemContainer items={itemsDestacados} destacado={true} />
          </Fade>
        </div>
      )}

      <div className="p-4">
        <h3 className="flex items-center gap-2 text-lg mb-4">
          <span className="font-medium">Nuestro Menú</span>
        </h3>
        <Fade key={`fade-menu-${fadeKey}`} triggerOnce={false} duration={600}>
          <ItemContainer items={currentItems} />
        </Fade>
        {itemsFiltrados.length > itemsPerPage && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Siguiente >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< Anterior"
            renderOnZeroPageCount={null}
            containerClassName="flex gap-2 justify-center my-4"
            pageClassName="px-2 py-1 bg-gray-200 rounded"
            activeClassName="bg-red-800 text-white"
            previousClassName="px-2 py-1 bg-gray-200 rounded"
            nextClassName="px-2 py-1 bg-gray-200 rounded"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
}

export default App;