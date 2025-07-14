import { LayoutGrid } from 'lucide-react';

export default function CategoryFilter({ categorias, selectedCategoria, setSelectedCategoria }) {
  if (categorias.length === 0) {
    return <p className="mb-4 p-4">No hay categorías disponibles.</p>
  }
  return (
    <ul className="flex flex-row gap-2 whitespace-nowrap overflow-x-auto scrollbar-hide py-2 p-4">
      <li
        className={`cursor-pointer flex gap-1 items-center px-6 py-2 ml-1 rounded-full shadow-md transition-all duration-300
          ${selectedCategoria === null
            ? "bg-red-900 text-white scale-105"
            : "bg-white text-black"
        }`}
        onClick={() => setSelectedCategoria(null)}
      >
        <span className="leading-none ">Todas</span>
      </li>
      {categorias.map((categoria, idx) => (
        <li
          key={idx}
          className={`cursor-pointer px-6 py-2 rounded-full shadow-md transition-all duration-300
            ${selectedCategoria === categoria
              ? "bg-red-900 text-white scale-105"
              : "bg-white text-black"
            }`}
          onClick={() => setSelectedCategoria(categoria)}
        >
          <span className="leading-none  ">{categoria}</span>
        </li>
      ))}
    </ul>
  )
}