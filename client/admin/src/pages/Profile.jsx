import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User2, ShieldCheck, Package } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogoutConfirm = async () => {
    try {
      setIsProcessing(true);
      logout();
      showAlert?.("Has cerrado sesión correctamente.", "success");
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
      showAlert?.("No se pudo cerrar sesión. Intenta de nuevo.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <main className="p-4 max-w-lg mx-auto">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-center">No has iniciado sesión</h2>
            <p className="text-sm text-muted-foreground text-center">
              Para ver tu perfil inicia sesión.
            </p>
            <Button onClick={() => navigate("/")}>Ir al inicio</Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-2 sm:p-6 max-w-3xl mx-auto">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-20 h-20 mb-4 sm:mb-0">
            {/* <AvatarImage src={user.avatarUrl} /> */}
            <AvatarFallback className="text-2xl">
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div className="w-full flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-semibold text-center sm:text-left">{user.nombre ?? "Usuario"}</h1>
                <p className="text-sm text-muted-foreground text-center sm:text-left">ID: {user.id ?? "-"}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {user.admin && (
                  <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-50 text-green-700 text-xs sm:text-sm">
                    <ShieldCheck size={16} /> Admin
                  </span>
                )}
                {user.repartidor && (
                  <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs sm:text-sm">
                    <Package size={16} /> Repartidor
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2 text-center sm:text-left">
                Información
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                <li className="flex gap-2 items-center">
                  <User2 className="w-4 h-4 mt-1" /> 
                  <span>Nombre:</span> 
                  <span className="ml-2 font-medium">{user.nombre ?? "-"}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span>ID:</span> 
                  <span className="ml-2 font-medium">{user.id ?? "-"}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <span>Roles:</span>
                  <span className="ml-2 font-medium">
                    {(user.admin ? "admin " : "") + (user.repartidor ? "repartidor" : "") || "usuario"}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" aria-label="Cerrar sesión" className="inline-flex items-center gap-2 w-full sm:w-auto">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro que quieres cerrar sesión? Se te redirigirá al inicio.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button variant="outline">
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogoutConfirm}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Cerrando..." : "Sí, cerrar sesión"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" onClick={() => navigate(-1)} className="w-full sm:w-auto">Volver</Button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}