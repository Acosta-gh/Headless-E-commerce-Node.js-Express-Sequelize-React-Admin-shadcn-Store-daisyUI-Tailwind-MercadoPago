import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Componente para manejar iconos y estados de manera consistente
const NavIcon = ({ to, activeIcon, inactiveIcon, label, badge = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <li className="relative group">
      <NavLink 
        to={to} 
        aria-label={label}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {({ isActive }) => (
          <div className="relative flex flex-col items-center">
            {/* Línea indicadora con animación suave */}
            <span
              className={`
                relative text-white transition-all duration-200
                after:absolute after:left-0 after:bottom-[-8px] after:h-0.5 
                after:w-full after:bg-white after:origin-left
                after:transition-transform after:duration-300
                hover:text-white/90
                ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-50"}
              `}
            >
              {isActive ? activeIcon : inactiveIcon}
              
              {/* Tooltip con animación */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute whitespace-nowrap left-1/2 transform -translate-x-1/2 -bottom-10 
                              bg-gray-800 text-white text-xs py-1 px-2 rounded-md z-50"
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
            
            {/* Badge con animación */}
            {badge}
          </div>
        )}
      </NavLink>
    </li>
  );
};

const HeaderNavDesktop = () => {
  const { totalItems } = useCart();

  return (
    <nav className="">
      <div className="container mx-auto px-4 py-2">
        <ul className="hidden md:flex space-x-6 items-center justify-end">
          <NavIcon
            to="/"
            label="Inicio"
            activeIcon={
              <svg
                className="size-6 scale-110 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            }
            inactiveIcon={
              <svg
                className="size-6 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            }
          />
          
          <NavIcon
            to="/carrito"
            label="Carrito de compras"
            activeIcon={
              <svg
                className="size-6 scale-110 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
            }
            inactiveIcon={
              <svg
                className="size-6 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            }
            // Icono con badge para mostrar el número de artículos en el carrito
            badge={
              totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md"
                >
                  {totalItems}
                </motion.span>
              )
            }
          />
          
          <NavIcon
            to="/perfil"
            label="Mi perfil"
            activeIcon={
              <svg
                className="size-6 scale-110 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            inactiveIcon={
              <svg
                className="size-6 transition-all duration-300 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            }
          />
  
        </ul>
      </div>
    </nav>
  );
};

export default HeaderNavDesktop;