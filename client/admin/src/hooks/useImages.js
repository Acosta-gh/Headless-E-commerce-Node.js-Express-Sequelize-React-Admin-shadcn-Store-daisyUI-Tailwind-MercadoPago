import { useState, useCallback } from "react";
import imagenService from "../services/imagesService"; 

export default function useImagen() {
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener imagen por ID
  const getImagen = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await imagenService.getById(id);
      setImagen(data);
      return data;
    } catch (err) {
      setError(err.message);
      setImagen(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear imagen (acepta FormData o JSON)
  const createImagen = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await imagenService.createImagen(payload);
      setImagen(data);
      return data;
    } catch (err) {
      setError(err.message);
      setImagen(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar imagen por ID
  const deleteImagen = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await imagenService.deleteImagen(id);
      setImagen(null); // Limpia el estado
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    imagen,
    loading,
    error,
    getImagen,
    createImagen,
    deleteImagen,
  };
}