import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div>
      <Header />
      <main className="md:pt-16 bg-[var(--color-background)]"> {/* Se añade un padding-top para evitar que el contenido quede oculto debajo del header */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}