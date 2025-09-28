import { useState, useEffect } from "react";
import purchasesService from "@/services/purchasesService";
import { useAlert } from "@/context/AlertContext";

export default function usePurchases() {
    const [purchases, setPurchases] = useState([]);
    const { showAlert } = useAlert() || {};

    useEffect(() => {
        fetchPurchases();
    }, []);
    
    const fetchPurchases = async () => {
        try {
            const res = await purchasesService.getAll();
            setPurchases(res);
        } catch (error) {
            if (typeof showAlert === "function") {
                showAlert(error.message || "Error al cargar compras", "error");
            }
        }
    };
    return { purchases };
}