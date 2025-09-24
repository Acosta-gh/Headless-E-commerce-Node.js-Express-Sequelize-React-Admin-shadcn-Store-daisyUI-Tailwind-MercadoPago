import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { AlertProvider } from "@/context/AlertContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import ScrollToTop from "@/components/ScrollToTop"; 

export default function App() {
  return (
    <BrowserRouter> {/* Proveedor de enrutamiento */}
      <ScrollToTop /> {/* Componente que hace que al cambiar de ruta, la página inicie en la parte superior */}
      <AlertProvider> {/* Proveedor de contexto de alertas */}
        <AuthProvider> {/* Proveedor de contexto de autenticación */}
          <CartProvider> {/* Proveedor de contexto del carrito de compras */}
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}
