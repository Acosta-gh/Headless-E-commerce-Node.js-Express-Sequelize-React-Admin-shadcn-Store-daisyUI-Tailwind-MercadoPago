import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AlertProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AlertProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
