import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import { Fade } from "react-awesome-reveal";

/**
 * Componente de diseño principal de la aplicación.
 * 
 * Renderiza el encabezado, el contenido principal y el pie de página.
 * Ajusta el margen superior del contenido principal dependiendo de la ruta actual:
 * - Si la ruta es '/', aplica un margen superior menor.
 * - Para otras rutas, aplica un margen superior mayor.
 * 
 * Utiliza `useLocation` para determinar la ruta actual y `Outlet` para renderizar las rutas hijas.
 *
 * @component
 */
export default function Layout() {
  const location = useLocation();
  // Si la ruta es '/', no aplicamos margin-bottom extra
  const isRoot = location.pathname === "/";

  return (
    <div>
      <Header />
      <main
        className={` min-h-screen bg-[var(--color-background)] pb-24 sm:pb-0 ${!isRoot ? "sm:pt-35" : "sm:pt-19"}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}