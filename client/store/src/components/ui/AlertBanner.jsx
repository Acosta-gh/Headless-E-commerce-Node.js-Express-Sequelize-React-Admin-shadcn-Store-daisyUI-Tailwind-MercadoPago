import React from "react";
import { useAlert } from "@/context/AlertContext";

export default function AlertBanner() {
  const { alert, closeAlert } = useAlert();

  if (!alert) return null;

  const typeMap = {
    error: "alert-error",
    success: "alert-success",
    warning: "alert-warning",
    info: "alert-info",
  };
  const alertClass = typeMap[alert.type] || "alert-info";

  return (
    <div className="toast toast-top toast-center z-99">
      <div className={`alert ${alertClass} flex justify-between items-center`}>
        <span>{alert.message}</span>
        <button
          className="btn btn-sm btn-ghost ml-2"
          onClick={closeAlert}
          aria-label="Cerrar"
        >
        </button>
      </div>
    </div>
  );
}