import React from "react";
import SidePanel from "../components/SidePanel";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
     

        {/* Contenido principal */}
        <main className="flex-1 p-6 pl-1 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Home</h1>
            <p className="text-sm text-slate-600 mb-6">
              Bienvenido — usa el sidepanel para navegar entre Productos, Categorías, Compras, Usuarios y Perfil.
            </p>

            {/* Ejemplo de contenido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">Panel A</div>
              <div className="bg-white p-4 rounded shadow">Panel B</div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;