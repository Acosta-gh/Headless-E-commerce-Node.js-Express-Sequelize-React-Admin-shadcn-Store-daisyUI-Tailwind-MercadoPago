import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import { Fade } from "react-awesome-reveal";

export default function Layout() {
  return (
    <div>
      <Header />
      <main className="md:pt-26 md:pb-0 pb-16 min-h-screen bg-[var(--color-background)]"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
} 