import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function CategoryCards({ categories, onEdit, onDelete }) {
  return (
    <>
      {categories.map((cat) => (
        <div key={cat.id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <div className="font-semibold">{cat.nombre}</div>
              <div className="text-xs text-gray-500">{cat.descripcion}</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span
              className="px-2 py-1 rounded text-white"
              style={{ background: cat.color || "#aaa", fontSize: "0.9em" }}
            >
              {cat.color}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(cat)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(cat.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}