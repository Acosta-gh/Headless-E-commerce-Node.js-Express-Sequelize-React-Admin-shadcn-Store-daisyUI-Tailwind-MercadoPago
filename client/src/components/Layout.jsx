import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import { Fade } from "react-awesome-reveal";

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