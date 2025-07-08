import { NavLink } from "react-router-dom";

const HeaderNavDesktop = () => (
  <ul className="hidden md:flex space-x-4">
    <li>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `relative text-white transition-all duration-100 ease-in-out
          after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-white after:origin-left
          after:transition-transform after:duration-300 ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`
        }
      >
        Inicio
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          `relative text-white transition-all duration-100 ease-in-out
          after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-white after:origin-left
          after:transition-transform after:duration-300 ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`
        }
      >
        Perfil
      </NavLink>
    </li>
    <li>
      <NavLink to="/logout" className="text-white">
        Cerrar Sesión
      </NavLink>
    </li>
  </ul>
);

export default HeaderNavDesktop;