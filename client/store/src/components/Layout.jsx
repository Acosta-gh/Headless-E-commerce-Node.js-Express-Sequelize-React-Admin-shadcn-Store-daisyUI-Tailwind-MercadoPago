import React from "react";
import { Outlet } from "react-router-dom";
import AlertBanner from "@/components/ui/AlertBanner";
import SpeedDial from "@/components/ui/SpeedDial";

import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function Layout() {
  return (
    <div>
      {/* Navbar */}
      <Header />

      {/* Contenido principal */}
      <div className="min-h-[calc(100vh-8rem)]">
        <AlertBanner />
        <Outlet />
        <SpeedDial /> 
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
