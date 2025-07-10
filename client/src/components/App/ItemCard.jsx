export default function ItemCard({ item, onClick }) {
  return (
    <div
      className={
        `bg-white shadow-md rounded-lg p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all
        ${item.stock <= 0 || item.disponible === false ? "opacity-50 grayscale pointer-events-none" : ""}`
      }
      onClick={onClick}
    >
      <img
        src={item.imagenUrl}
        alt={item.nombre}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{item.nombre}</h2>
      <p className="text-gray-500 mb-1">{item.descripcion}</p>
      <span className="text-lg font-bold text-green-800">${item.precio}</span>
      <div className="mt-2 text-sm text-gray-400">
        {item.categoria?.nombre || "Sin categoría"}{" "}
        {item.stock <= 0 || item.disponible === false ? (
          <></>
        ) : (
          <>| Stock: {item.stock}</>
        )}{" "}
      </div>
    </div>
  )
}