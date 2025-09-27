import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import useUsers from "@/hooks/useUsers";
import usePurchases from "@/hooks/usePurchases";
import PurchaseTable from "@/components/profile/PurchaseTable";

function Profile() {
  const { user } = useAuth() || {};
  const [showModal, setShowModal] = useState(false);
  const { userData, loading, updateUser } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    direccion: "",
    telefono: "",
    nombre: "",
  });

  const { purchases } = usePurchases();

  useEffect(() => {
    setShowModal(!user);
  }, [user]);

  useEffect(() => {
    if (userData) {
      setFormData({
        direccion: userData.direccion || "",
        telefono: userData.telefono || "",
        nombre: userData.nombre || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateUser(formData);
      if (updated) {
        setFormData({
          direccion: updated.direccion || "",
          telefono: updated.telefono || "",
          nombre: updated.nombre || "",
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <LoginModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-200 py-30 px-2 sm:px-0">
      <div className="card w-full max-w-md bg-base-100 shadow-xl mb-12">
        <div className="card-body items-center text-center">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userData.nombre}`}
                alt={userData.nombre}
              />
            </div>
          </div>

          {/* Nombre */}
          <h2 className="card-title mt-4">
            {!isEditing ? (
              userData.nombre
            ) : (
              <div className="form-control mt-2 w-full">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </h2>
          <p className="text-sm opacity-70 break-all">ID: {user.id}</p>

          {/* Roles */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span
              className={`badge ${
                user.admin ? "badge-success" : "badge-outline"
              }`}
            >
              {user.admin ? "Admin" : "No Admin"}
            </span>
            <span
              className={`badge ${
                user.repartidor ? "badge-info" : "badge-outline"
              }`}
            >
              {user.repartidor ? "Repartidor" : "Cliente"}
            </span>
          </div>

          {/* Datos editables */}
          <div className="mt-4 w-full text-left space-y-2">
            <p>
              <strong>Email:</strong> <span className="break-all">{userData.email}</span>
            </p>
            {isEditing ? (
              <>
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Dirección</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Teléfono</span>
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            ) : (
              <div className="mt-2 space-y-1">
                <p>
                  <strong>Dirección:</strong>{" "}
                  {userData.direccion || "No especificada"}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {userData.telefono || "No especificado"}
                </p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="card-actions mt-4 flex flex-col sm:flex-row gap-2 w-full">
            {isEditing ? (
              <>
                <button className="btn btn-success w-full sm:w-auto" onClick={handleSave}>
                  Guardar
                </button>
                <button
                  className="btn btn-ghost w-full sm:w-auto"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={() => setIsEditing(true)}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-2 sm:px-12">
        {!purchases || purchases.length === 0 ? (
          <p className="text-gray-500 text-center">No hay compras.</p>
        ) : (
          purchases.map((compra) => (
            <PurchaseTable key={compra.id} compra={compra} />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;