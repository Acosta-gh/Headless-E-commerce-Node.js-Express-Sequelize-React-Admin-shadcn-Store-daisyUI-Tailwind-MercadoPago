import { useState, useEffect } from "react";
import productsService from "@/services/productsService";

export default function useProductById(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    productsService
      .getById(id)
      .then((res) => setProduct(res))
      .catch(() => setError("Error al cargar producto"))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}