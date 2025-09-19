import React from "react";
import { createPortal } from "react-dom";
import { useAlert } from "../../context/AlertContext";
import {
  Alert as ShadAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const TYPE_META = {
  info: {
    icon: Info,
    title: "Info",
    classes: "bg-blue-50 border-blue-300 text-blue-800",
    iconClass: "text-blue-600",
  },
  success: {
    icon: CheckCircle,
    title: "Éxito",
    classes: "bg-green-50 border-green-300 text-green-800",
    iconClass: "text-green-600",
  },
  warning: {
    icon: AlertTriangle,
    title: "Atención",
    classes: "bg-yellow-50 border-yellow-300 text-yellow-800",
    iconClass: "text-yellow-600",
  },
  error: {
    icon: XCircle,
    title: "Error",
    classes: "bg-red-50 border-red-300 text-red-800",
    iconClass: "text-red-600",
  },
};

export default function AlertBanner() {
  const alertCtx = useAlert() || {};
  const { alert, closeAlert } = alertCtx;

  if (!alert) return null;

  const { message, type = "info", title } = alert;
  const messageStr =
    typeof message === "string" ? message : JSON.stringify(message, null, 2);

  const meta = TYPE_META[type] || TYPE_META.info;
  const Icon = meta.icon;

  const alertEl = (
    <div className="pointer-events-none">
      <div
        className="fixed top-4 right-4 z-[9999] pointer-events-auto"
        role="status"
        aria-live="polite"
      >
        <ShadAlert
          className={`max-w-md w-full shadow-lg border rounded-md flex items-start gap-3 p-3 ${meta.classes}`}
        >
          <div className={`pt-1 ${meta.iconClass}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <AlertTitle>{title ?? meta.title}</AlertTitle>
            <AlertDescription>{messageStr}</AlertDescription>
          </div>
          <button
            onClick={closeAlert}
            aria-label="Cerrar alerta"
            className="ml-2 text-sm font-bold hover:opacity-70"
          >
            ✕
          </button>
        </ShadAlert>
      </div>
    </div>
  );

  return createPortal(alertEl, document.body);
}
