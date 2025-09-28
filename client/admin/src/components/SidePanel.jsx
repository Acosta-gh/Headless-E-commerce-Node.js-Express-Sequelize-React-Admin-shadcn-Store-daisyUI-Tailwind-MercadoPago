import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box, List, ShoppingCart, Users, User, Menu, X } from "lucide-react";

const items = [
  { key: "productos", label: "Productos", to: "/admin/products", icon: Box },
  {
    key: "categorias",
    label: "Categorías",
    to: "/admin/categories",
    icon: List,
  },
  { key: "compras", label: "Compras", to: "/purchases", icon: ShoppingCart },
  { key: "usuarios", label: "Usuarios", to: "/admin/users", icon: Users },
  { key: "perfil", label: "Perfil", to: "/profile", icon: User },
];

function NavItem({ to, label, Icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm
        ${
          active
            ? "bg-slate-100 text-slate-900 font-medium"
            : "text-slate-600 hover:bg-slate-50"
        }
      `}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

export default function SidePanel() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  // Cierra el sidepanel (mobile) al hacer click en un nav item
  const handleNavClick = () => setOpen(false);

  return (
    <>
      {/* MOBILE: Sheet (slide-over) */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="p-3 flex items-center justify-between">
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Abrir menú">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent side="left" className="w-72">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  {import.meta.env.VITE_NOMBRE_ECOMMERCE}
                </div>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-96px)] p-4">
              <nav className="flex flex-col gap-2">
                {items.map((it) => (
                  <NavItem
                    key={it.key}
                    to={it.to}
                    label={it.label}
                    Icon={it.icon}
                    active={isActive(it.to)}
                    onClick={handleNavClick}
                  />
                ))}
              </nav>
            </ScrollArea>

            <div className="p-4 border-t">
              <Link
                to="/profile"
                className="flex items-center gap-3"
                onClick={handleNavClick}
              >
                <User className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-700">Ver perfil</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP: Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:sticky md:top-0 bg-white border-r">
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="text-2xl font-bold">
            {import.meta.env.VITE_NOMBRE_ECOMMERCE}
          </div>
        </div>

        <ScrollArea className="p-4 flex-1">
          <nav className="flex flex-col gap-2">
            {items.map((it) => (
              <NavItem
                key={it.key}
                to={it.to}
                label={it.label}
                Icon={it.icon}
                active={isActive(it.to)}
              />
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Link to="/profile" className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-600" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">Administrador</span>
              <span className="text-xs text-slate-500">Ver perfil</span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
