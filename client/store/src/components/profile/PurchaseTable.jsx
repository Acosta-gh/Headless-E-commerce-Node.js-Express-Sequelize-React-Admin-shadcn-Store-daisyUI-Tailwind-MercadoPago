import React from "react";
import { TriangleAlert } from "lucide-react";
import {
  MapPin,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function PurchaseTable({ compra }) {
  if (!compra) return <p className="text-center">No hay datos de la compra.</p>;

  const {
    id,
    pagado,
    direccionEntrega,
    metodoPago,
    total,
    fechaPedido,
    Usuario,
    Items,
    estado,
  } = compra;

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg mb-4 mx-auto w-5xl">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title font-semibold flex flex-col sm:flex-row sm:justify-between sm:items-center  gap-2">
        <span>
          Pedido <strong>#{id}</strong>
        </span>
        <div className="gap-4 flex flex-col sm:flex-row sm:items-center text-sm sm:text-base">
          <span>
            Total:{" "}
            <strong>
              {total?.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </strong>
          </span>
          <span>
            Estado: <span className="badge badge-info">{estado}</span>
          </span>
        </div>
      </div>

      <div className="collapse-content text-sm">
        <div className="card bg-base-100 shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold ">Dirección de Entrega</div>
                <div className="">{direccionEntrega}</div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold ">Método de Pago</div>
                <div className=" capitalize">{metodoPago}</div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold ">Fecha</div>
                <div className="">{new Date(fechaPedido).toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
              {pagado ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <div>
                <div className="font-semibold ">Pagado</div>
                <span
                  className={`badge ${
                    pagado ? "badge-success" : "badge-error"
                  } px-3 py-1`}
                >
                  {pagado ? "Sí" : "No"}
                </span>
              </div>
            </div>
          </div>
          {!pagado && (
            <div className="alert alert-warning mb-6">
              <div className="flex-1 flex items-center gap-3">
                <TriangleAlert />
                <label>
                  Hola, {Usuario?.nombre || "Cliente"}. Tu pedido{" "}
                  <strong>#{id}</strong> está pendiente de pago.
                  {metodoPago === "mercadopago" && (
                    <>
                      {" "}
                      Si ya realizaste el pago a través de MercadoPago, por
                      favor espera a que el procesador confirme la transacción.
                      Si cancelaste el pago, puedes ignorar este mensaje.
                    </>
                  )}
                  {metodoPago === "transferencia" && (
                    <>
                      {" "}
                      Si ya hiciste la transferencia, por favor envíanos el
                      comprobante para verificar el pago. Si decidiste no
                      continuar, puedes ignorar este mensaje.
                    </>
                  )}
                  {!["mercadopago", "transferencia"].includes(metodoPago) && (
                    <>
                      {" "}
                      Por favor, sigue las instrucciones del método de pago
                      seleccionado.
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
          {/* Tabla de items */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs sm:text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th>Producto</th>
                  <th className="hidden sm:table-cell">Descripción</th>
                  <th className="hidden md:table-cell">Color</th>
                  <th>Precio</th>
                  <th className="hidden sm:table-cell">Categoría</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={
                                item.imagenUrl ||
                                "https://via.placeholder.com/48"
                              }
                              alt={item.nombre}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/48";
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell ">
                      {item.descripcion?.slice(0, 60)}
                      {item.descripcion &&
                        item.descripcion.length > 60 &&
                        "..."}
                    </td>
                    <td className="hidden md:table-cell">{item.color}</td>
                    <td>
                      {item.precio?.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="hidden sm:table-cell">
                      {item.categoria?.nombre || "—"}
                    </td>
                    <td>{item.cantidad || 1}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs">detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-base-200">
                <tr>
                  <td colSpan={5}></td>
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
      </div>
    </div>
  );
}

export default PurchaseTable;
