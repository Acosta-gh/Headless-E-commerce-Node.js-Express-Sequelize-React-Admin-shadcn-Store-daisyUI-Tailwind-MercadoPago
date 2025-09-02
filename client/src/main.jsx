import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AlertProvider>
          <PayPalScriptProvider options={initialOptions}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PayPalScriptProvider>
        </AlertProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);