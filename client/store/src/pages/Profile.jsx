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

  const { purchases = [], loading: loadingPurchases } = usePurchases();

  // --- Paginación de compras ---
  const comprasPorPagina = 5;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(purchases.length / comprasPorPagina);
  const startIndex = (paginaActual - 1) * comprasPorPagina;
  const endIndex = startIndex + comprasPorPagina;
  const comprasPaginadas = purchases.slice(startIndex, endIndex);

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
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-base-200 py-25 px-2 sm:px-0">
      {/* Card perfil */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl mb-10">
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
              <strong>Email:</strong>{" "}
              <span className="break-all">{userData.email}</span>
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
              <div className="flex gap-2 w-full sm:justify-center flex-col sm:flex-row">
                <button
                  className="btn btn-success w-full sm:w-auto"
                  onClick={handleSave}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-ghost w-full sm:w-auto"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary m-auto"
                onClick={() => setIsEditing(true)}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compras */}
      <div className="w-full px-2 sm:px-12">
        {loadingPurchases ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-gray-500">No se encontraron compras.</p>
          </div>
        ) : (
          <>
            {comprasPaginadas.map((compra) => (
              <PurchaseTable key={compra.id} compra={compra} />
            ))}

            {/* Controles de paginación  */}
            {totalPaginas > 1 && (
              <div className="join flex justify-center mt-6 flex-wrap">
                {/* Botón anterior */}
                <button
                  className="join-item btn btn-sm"
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                >
                  «
                </button>

                {/* Si hay menos de 5 páginas, muestro todas */}
                {totalPaginas <= 5 ? (
                  Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPaginaActual(i + 1)}
                      className={`join-item btn btn-sm ${
                        paginaActual === i + 1 ? "btn-primary" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  <>
                    {/* Primera página */}
                    <button
                      onClick={() => setPaginaActual(1)}
                      className={`join-item btn btn-sm ${
                        paginaActual === 1 ? "btn-primary" : ""
                      }`}
                    >
                      1
                    </button>

                    {/* Mostrar ... si estoy lejos de la primera */}
                    {paginaActual > 3 && (
                      <button className="join-item btn btn-sm btn-disabled">
                        ...
                      </button>
                    )}

                    {/* Páginas cercanas a la actual */}
                    {Array.from({ length: 3 }, (_, i) => {
                      const page = paginaActual - 1 + i;
                      if (page > 1 && page < totalPaginas) {
                        return (
                          <button
                            key={page}
                            onClick={() => setPaginaActual(page)}
                            className={`join-item btn btn-sm ${
                              paginaActual === page ? "btn-primary" : ""
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {/* Mostrar ... si estoy lejos del final */}
                    {paginaActual < totalPaginas - 2 && (
                      <button className="join-item btn btn-sm btn-disabled">
                        ...
                      </button>
                    )}

                    {/* Última página */}
                    <button
                      onClick={() => setPaginaActual(totalPaginas)}
                      className={`join-item btn btn-sm ${
                        paginaActual === totalPaginas ? "btn-primary" : ""
                      }`}
                    >
                      {totalPaginas}
                    </button>
                  </>
                )}

                {/* Botón siguiente */}
                <button
                  className="join-item btn btn-sm"
                  disabled={paginaActual === totalPaginas}
                  onClick={() =>
                    setPaginaActual((p) => Math.min(p + 1, totalPaginas))
                  }
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
