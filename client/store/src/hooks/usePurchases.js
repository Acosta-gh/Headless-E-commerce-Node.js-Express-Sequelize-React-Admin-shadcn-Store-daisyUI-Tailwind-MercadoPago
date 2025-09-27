import { useState, useEffect } from "react";
import purchasesService from "@/services/purchasesService";
import { useAuth } from "@/context/AuthContext";

export default function usePurchases() {
  const [purchases, setPurchases] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth() || {};

  useEffect(() => {
    if (!user) return;
    fetchPurchases();
    // eslint-disable-next-line
  }, [user]);

  const fetchPurchases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await purchasesService.getByUser();
      setPurchases(res);
    } catch (err) {
      setError("Error al cargar compras");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  return { purchases, loading, error, refetch: fetchPurchases };
}