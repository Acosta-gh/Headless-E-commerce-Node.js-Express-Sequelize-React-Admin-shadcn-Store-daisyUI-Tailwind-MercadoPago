import { useState, useEffect, useCallback } from "react";
import usersService from "@/services/usersService";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";

export default function useUsers() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert() || {};
  const { user } = useAuth() || {};

  const fetchUser = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await usersService.getUsuarioById(user.id);

      setUserData(res);
    } catch (error) {
      if (typeof showAlert === "function") {
        showAlert(error.message || "Error al cargar usuario", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, showAlert]);

  const updateUser = useCallback(
    async (payload) => {
      if (!user?.id) return;
      try {
        const updated = await usersService.updateUsuario(user.id, payload);
        setUserData(updated.usuario);
        console.log("Usuario actualizado:", updated);
        console.log("Payload enviado:", payload);
        if (typeof showAlert === "function") {
          showAlert("Usuario actualizado correctamente", "success");
        }
        return updated;
      } catch (error) {
        if (typeof showAlert === "function") {
          showAlert(error.message || "Error al actualizar usuario", "error");
        }
        throw error;
      }
    },
    [user?.id, showAlert]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { userData, loading, fetchUser, updateUser };
}
