import ItemCard from "./ItemCard";
import { useNavigate } from "react-router-dom";

export default function ItemGrid({ items }) {
  const navigate = useNavigate();
  if (items.length === 0) {
    return <p>No hay items disponibles.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => navigate(`/item/${item.id}`)}
        />
      ))}
    </div>
  )
}