import { useState, useEffect } from "react";
import { getAllItems } from "./services/itemService.js";
import CategoryFilter from "./components/App/CategoryFilter";
import SearchBar from "./components/App/SearchBar";
import ItemContainer from "./components/App/ItemContainer.jsx";
import Loading from "./components/Ui/Loading.jsx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "./components/App/Banner.jsx";
import { Star, SquareArrowOutUpRight } from "lucide-react";


function App() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [search, setSearch] = useState("");

  // PAGINATION STATES
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
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

  // Resetear paginación cuando cambia el filtro o búsqueda
  useEffect(() => {
    setItemOffset(0);
    setCurrentPage(0);
  }, [selectedCategoria, search]);

  const categoriasUnicas = [
    ...new Set(
      items.map((item) => item.categoria?.nombre).filter((nombre) => nombre)
    ),
  ];

  const itemsFiltrados = items.filter((item) => {
    const coincideCategoria = selectedCategoria
      ? item.categoria?.nombre === selectedCategoria
      : true;
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (item.descripcion &&
        item.descripcion.toLowerCase().includes(search.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  const itemsDestacados = itemsFiltrados.filter((item) => item.destacado);

  // PAGINATION LOGIC
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = itemsFiltrados.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(itemsFiltrados.length / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    const newOffset = (pageNumber * itemsPerPage) % itemsFiltrados.length;
    setCurrentPage(pageNumber);
    setItemOffset(newOffset);
  };

  if (loading) return <Loading />;

  // Variantes de animación para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div>
      {/* Banner con animación de entrada */}
      <Banner/>

      {/* Contenedor principal con animación de entrada */}
      <motion.div
        className="mx-auto max-w-7xl  sm:px-6 sm:pt-3 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl text-gray-900 font-semibold p-4 pb-0"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Elige tu comida <span className="text-[var(--color-accent)]">favorita</span>
        </motion.h1>

        {/* Filtro de categorías con animación */}
        <SearchBar search={search} setSearch={setSearch} />

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <CategoryFilter
            categorias={categoriasUnicas}
            selectedCategoria={selectedCategoria}
            setSelectedCategoria={setSelectedCategoria}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {itemsDestacados.length > 0 && (
            <motion.div
              key="destacados"
              className="mb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="pr-4 flex flex-row items-center justify-between sm:justify-start">
                <motion.h3
                  className="flex items-center gap-2 p-4 text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Star
                    color="var(--color-accent)"
                    fill="var(--color-accent)"
                    size={20}
                    className="inline-block align-middle relative bottom-[1.5px] left-[3px]"
                  />
                  <span className="font-medium">Destacados</span>
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* 
                <Link
                  to="/destacados"
                  className="text-red-800 font-medium sm:text-sm sm:items-center sm:justify-center flex gap-1 hover:text-red-900 transition-all duration-300"
                >
                  Ver Todos
                  <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400 }}>
                    <SquareArrowOutUpRight size={16} className="hidden sm:block" />
                  </motion.div>
                </Link>
                */}
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`destacados-${selectedCategoria}-${search}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ItemContainer items={itemsDestacados} destacado={true} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h3
            className="flex items-center gap-2 text-lg mb-4"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="font-medium">Nuestro Menú</span>
          </motion.h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={`menu-${selectedCategoria}-${search}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ItemContainer items={currentItems} />
            </motion.div>
          </AnimatePresence>

          {itemsFiltrados.length > itemsPerPage && (
            <motion.div
              className="flex gap-2 justify-center my-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {/* Botón anterior */}
              <motion.button
                whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
                onClick={() =>
                  currentPage > 0 && handlePageClick(currentPage - 1)
                }
                className={`px-3 py-1.5 rounded-lg font-medium ${currentPage === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                disabled={currentPage === 0}
              >
                &lt; Anterior
              </motion.button>

              {/* Botones de página */}
              <div className="flex gap-2">
                {Array.from({ length: pageCount }, (_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePageClick(i)}
                    className={`w-9 h-9 rounded-lg font-medium flex items-center justify-center ${currentPage === i
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    animate={currentPage === i ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>

              {/* Botón siguiente */}
              <motion.button
                whileHover={{ scale: currentPage >= pageCount - 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage >= pageCount - 1 ? 1 : 0.95 }}
                onClick={() =>
                  currentPage < pageCount - 1 && handlePageClick(currentPage + 1)
                }
                className={`px-3 py-1.5 rounded-lg font-medium ${currentPage >= pageCount - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                disabled={currentPage >= pageCount - 1}
              >
                Siguiente &gt;
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
