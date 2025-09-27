import React from "react";

function PurchaseTable({ compra }) {
  if (!compra) return <p className="text-center text-gray-500">No hay datos de la compra.</p>;

  const {
    id,
    pagado,
    direccionEntrega,
    metodoPago,
    total,
    fechaPedido,
    Usuario,
    Items,
  } = compra;

  return (
    <div className="card bg-base-100 shadow-lg p-4 sm:p-6 mb-6">
      <h2 className="card-title text-lg sm:text-xl mb-3">
        Compra #{id}
      </h2>

      {/* Datos principales */}
      <div className="grid gap-2 text-sm sm:text-base mb-4">
        <p><span className="font-semibold">Usuario:</span> {Usuario?.nombre} ({Usuario?.email})</p>
        <p><span className="font-semibold">Teléfono:</span> {Usuario?.telefono}</p>
        <p><span className="font-semibold">Dirección de Entrega:</span> {direccionEntrega}</p>
        <p><span className="font-semibold">Método de Pago:</span> {metodoPago}</p>
        <p><span className="font-semibold">Fecha:</span> {new Date(fechaPedido).toLocaleString()}</p>
        <p>
          <span className="font-semibold">Pagado:</span>{" "}
          <span className={`badge ${pagado ? "badge-success" : "badge-error"}`}>
            {pagado ? "Sí" : "No"}
          </span>
        </p>
      </div>

      {/* Tabla de items */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-xs sm:text-sm">
          <thead className="bg-base-200">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="hidden sm:table-cell">Descripción</th>
              <th className="hidden md:table-cell">Color</th>
              <th>Precio</th>
              <th className="hidden sm:table-cell">Categoría</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {Items?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="font-medium">{item.nombre}</td>
                <td className="hidden sm:table-cell text-gray-600">{item.descripcion}</td>
                <td className="hidden md:table-cell">{item.color}</td>
                <td>
                  {item.precio?.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="hidden sm:table-cell">{item.categoria?.nombre || "—"}</td>
                <td>{item.cantidad || 1}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-base-200">
            <tr>
              <td colSpan={4}></td>
              <td colSpan={3} className="font-bold text-right">
                Total:{" "}
                {total?.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default PurchaseTable;
