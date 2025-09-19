import { useState, useEffect } from "react";
import categoriesService from "../services/categoriesService";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    categoriesService.getAll()
      .then(data => {
        if (mounted) setCategories(data);
      })
      .catch(() => {
        if (mounted) setError("Error al cargar categorías");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false };
  }, []);

  return { categories, error, loading };
}