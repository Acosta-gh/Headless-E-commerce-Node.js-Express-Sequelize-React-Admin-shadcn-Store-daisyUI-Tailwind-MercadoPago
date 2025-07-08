import { Routes, Route } from "react-router-dom";
import App from "../App";
import Layout from "../components/Layout";

import Carrito from "../pages/Carrito"
import Perfil from "../pages/Perfil"
import Logout from "../pages/Logout"
import SignUp from "../pages/SignUp"
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="perfil" element={<Perfil/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<SignUp/>}/>
        <Route path="logout" element={<Logout/>}/>
      </Route>
    </Routes>
  );
}   