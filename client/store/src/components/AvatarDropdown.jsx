import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AvatarDropdown() {
  const { user } = useAuth();

  return (
    <div className="dropdown dropdown-end">
      {/* Avatar */}
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="avatar avatar-placeholder relative bottom-[2px]">
            <div className="bg-neutral text-neutral-content w-9 rounded-full">
              <span className="text-xl">
                {user ? user.nombre.charAt(0) : "?"}
              </span>
            </div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link className="justify-between" to="/profile">
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/settings">Ajustes</Link>
          </li>
          <li>
            {!user && <Link to="/login">Iniciar sesión</Link>}
            {user && <Link to="/logout">Cerrar sesión</Link>}
          </li>
        </ul>
      </div>
    </div>
  );
}
export default AvatarDropdown;
