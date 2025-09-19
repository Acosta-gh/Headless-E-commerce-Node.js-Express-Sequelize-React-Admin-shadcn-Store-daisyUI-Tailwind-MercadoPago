import React from "react";
import SidePanel from "./SidePanel";
import { LoginModal } from "./auth/LoginModal";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <SidePanel />
        <main className="flex-1 p-6 pl-1 md:p-6">
          <div className="max-w-8xl mx-auto min-h-[100vh]">
            <Outlet />
            <LoginModal />
          </div>
        </main>
      </div>
    </div>
  );
}