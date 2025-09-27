import React, { useEffect, useState } from "react";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import Hero from "@/components/ui/Hero";
import CategoriesView from "@/components/home/CategoriesView";
import ProductsView from "@/components/home/ProductsView";
import Search from "@/components/home/Search";
import RangeFilter from "@/components/home/RangeFilter";
import { Fade } from "react-awesome-reveal";

function Home() {
  const { categories, loading: loadingCat, error: errorCat } = useCategories();
  const { products, loading: loadingProd, error: errorProd } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados con delay (debounce)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedCategory, setDebouncedCategory] = useState(selectedCategory);

  // Estado para mostrar spinner de carga
  const [loadingDebounce, setLoadingDebounce] = useState(false);

  // Debounce para búsqueda
  useEffect(() => {
    setLoadingDebounce(true);
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setLoadingDebounce(false);
    }, 400); // delay de 400ms
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce para categoría
  useEffect(() => {
    setLoadingDebounce(true);
    const handler = setTimeout(() => {
      setDebouncedCategory(selectedCategory);
      setLoadingDebounce(false);
    }, 300); // un poco más rápido para que no moleste
    return () => clearTimeout(handler);
  }, [selectedCategory]);

  // Filtrar productos
  const filteredProducts = debouncedCategory
    ? products.filter((p) => p.categoriaId === debouncedCategory.id)
    : products;

  const searchedProducts = filteredProducts.filter((p) =>
    p.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const prices = searchedProducts.map((p) => p.precio);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 100;

  const [rangeValue, setRangeValue] = useState(maxPrice);

  const rangeFilteredProducts = searchedProducts.filter(
    (p) => p.precio <= rangeValue
  );

  // Resetear rango cuando cambian los resultados
  useEffect(() => {
    setRangeValue(maxPrice);
  }, [maxPrice]);

  return (
    <div>
      <Hero />
      <div className="flex flex-row gap-10 p-6 max-w-8xl mx-auto">
        <section>
          <div className="mb-4">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          {loadingCat ? (
            <div className="flex items-center justify-center h-full w-full py-16">
              <span className="loading loading-spinner loading-xs"></span>
            </div>
          ) : errorCat ? (
            <p className="text-red-500">{errorCat}</p>
          ) : (
            <Fade>
              <CategoriesView
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </Fade>
          )}
          <div className="mb-4 mt-6">
            {(!loadingCat && minPrice !== maxPrice) && (
              <Fade triggerOnce>
                <RangeFilter
                  min={minPrice}
                  max={maxPrice}
                  value={rangeValue}
                  setValue={setRangeValue}
                />
              </Fade>
            )}
          </div>
        </section>

        <section className="flex-1">
          {loadingProd || loadingDebounce ? (
            <div className="flex items-center justify-center h-full w-full py-16">
              <span className="loading loading-spinner loading-xs"></span>
            </div>
          ) : errorProd ? (
            <p className="text-red-500">{errorProd}</p>
          ) : (
            <>
              {rangeFilteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h18v18H3V3z"
                    />
                  </svg>
                  <p className="text-gray-500 text-center text-lg">
                    {debouncedCategory
                      ? `No se encontraron productos disponibles en la categoría "${debouncedCategory.nombre}"`
                      : "No se encontraron productos disponibles."}
                  </p>
                </div>
              ) : (
                <Fade triggerOnce>
                  <ProductsView products={rangeFilteredProducts} />
                </Fade>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;
