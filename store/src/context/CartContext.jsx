import React, { createContext, useContext, useReducer, useEffect } from "react";

// El estado inicial es un array de items en el carrito
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

/**
 * Reducer para manejar acciones del carrito.
 * Cada item: { id, nombre, precio, imagenUrl, cantidad, stock }
 */
function cartReducer(state, action) {
  switch (action.type) {
    case "AGREGAR_ITEM": {
      const { item, cantidad = 1 } = action.payload;
      const cantidadToAdd = Number(cantidad);
      
      // Ensure cantidad is valid
      if (isNaN(cantidadToAdd) || cantidadToAdd <= 0) {
        console.error("Cantidad inválida:", cantidad);
        return state;
      }
      
      const existe = state.find(cartItem => cartItem.id === item.id);
      
      if (existe) {
        // Si ya está, suma la cantidad especificada sin exceder el stock
        return state.map(cartItem =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                cantidad: Math.min(
                  cartItem.cantidad + cantidadToAdd, 
                  cartItem.stock
                ),
              }
            : cartItem
        );
      } else {
        // Nuevo item con la cantidad especificada (sin exceder el stock)
        return [
          ...state,
          { 
            ...item, 
            cantidad: Math.min(cantidadToAdd, item.stock) 
          },
        ];
      }
    }
    case "QUITAR_ITEM": {
      return state
        .map(item =>
          item.id === action.payload
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0);
    }
    case "ELIMINAR_ITEM": {
      return state.filter(item => item.id !== action.payload);
    }
    case "VACIAR_CARRITO":
      return [];
    default:
      return state;
  }
}

// Creamos el contexto
const CartContext = createContext();

// Hook para usar el contexto
export const useCart = () => useContext(CartContext);

// Provider
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Lógica de acciones
  const agregarAlCarrito = (item, cantidad = 1) => {
    console.log(`Agregando ${cantidad} unidades de ${item.nombre} al carrito`);
    dispatch({ 
      type: "AGREGAR_ITEM", 
      payload: { item, cantidad } 
    });
  };
  
  const quitarDelCarrito = id => dispatch({ type: "QUITAR_ITEM", payload: id });
  const eliminarDelCarrito = id => dispatch({ type: "ELIMINAR_ITEM", payload: id });
  const vaciarCarrito = () => dispatch({ type: "VACIAR_CARRITO" });

  // Número total de items únicos (por ID)
  const totalUniqueItems = cart.length;

  // Suma total de cantidad de todos los items
  const totalItemQuantity = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Total precio
  const totalPrecio = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        agregarAlCarrito,
        quitarDelCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        totalItems: totalUniqueItems, // Changed to represent unique items
        totalItemQuantity, // New property for total quantity
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}