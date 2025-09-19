

export default function CategoriesView({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <ul className="menu bg-base-200 rounded-box w-full p-2 text-sm">
      <li className="menu-title">Categorías</li>
      <li>
        <a
          className={!selectedCategory ? "font-bold" : ""}
          onClick={() => onSelectCategory(null)}
        >
          Ver todos
        </a>
      </li>
      {categories.map((cat) => (
        <li key={cat.id}>
          <a
            className={selectedCategory?.id === cat.id ? "font-bold" : ""}
            onClick={() => onSelectCategory(cat)}
          >
            {cat.nombre}
          </a>
        </li>
      ))}
    </ul>
  );
}
