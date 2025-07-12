import ItemCard from "./ItemCard";
import { useNavigate } from "react-router-dom";

export default function ItemContainer({ items, destacado = false }) {
    const navigate = useNavigate();
    if (items.length === 0) {
        return <p>No hay items disponibles.</p>
    }

    const containerClass = destacado
        ? "flex flex-row flex-nowrap gap-3 overflow-x-auto scrollbar-hide py-2 px-1"
        : "grid grid-cols-1 md:grid-cols-3 gap-6";

    return (
        <div className={containerClass}>
            {items.map((item, i) =>
                destacado ? (
                    <div
                        key={item.id}
                        className={`min-w-[80px] max-w-[120px] flex-shrink-0 ${i === 0 ? "ml-3" : ""} ${i === items.length - 1 ? "mr-4" : ""}`}
                    >
                        <ItemCard
                            item={item}
                            onClick={() => navigate(`/item/${item.id}`)}
                            destacado={true}
                        />
                    </div>
                ) : (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate(`/item/${item.id}`)}
                    />
                )
            )}
        </div>
    );
}