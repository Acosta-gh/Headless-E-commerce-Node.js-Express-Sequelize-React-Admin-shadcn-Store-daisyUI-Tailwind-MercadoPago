export default function ItemCard({ item, onClick, destacado = false }) {
  return (
    <div
    
      className={
        `bg-white shadow-md rounded-lg ${destacado ? "p-1" : "p-4"} cursor-pointer hover:scale-105 hover:shadow-2xl transition-all
        ${item.stock <= 0 || item.disponible === false ? "opacity-50 grayscale pointer-events-none" : ""}`
      }
      onClick={onClick}
      style={destacado ? { maxWidth: 120, minWidth: 80 } : {}}
    >
      
      <img
        src={item.imagenUrl}
        alt={item.nombre}
        className={`w-full object-cover rounded-md mb-2 ${destacado ? "h-12" : "h-40"}`}
      />
      <h2 className={`font-semibold mb-1 ${destacado ? "text-xs" : "text-xl"}`}>{item.nombre}</h2>
      <p className={`${destacado ? "text-[10px]" : "text-gray-500"} mb-1`}>{item.descripcion}</p>
      <span className={`font-bold text-green-800 ${destacado ? "text-xs" : "text-lg"}`}>${item.precio}</span>
      <div className={`mt-1 text-gray-400 ${destacado ? "text-[10px]" : "text-sm"}`}>
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