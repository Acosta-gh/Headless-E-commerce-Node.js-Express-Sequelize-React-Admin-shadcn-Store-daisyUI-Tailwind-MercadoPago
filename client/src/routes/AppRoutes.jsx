import { Routes, Route } from "react-router-dom";
import App from "../App";
import Layout from "../components/Layout";

import Carrito from "../pages/Carrito"
import Perfil from "../pages/Perfil"
import Logout from "../pages/Logout"
import AdminPanel from "../pages/AdminPanel";
import Item from "../pages/Item";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="perfil" element={<Perfil/>}/>
        <Route path="logout" element={<Logout/>}/>  
        <Route path="admin" element={<AdminPanel/>}/>
        <Route path="item/:id" element={<Item />} />
        <Route path="*" element={<NotFound />} /> 
      </Route>
    </Routes>
  );
}   