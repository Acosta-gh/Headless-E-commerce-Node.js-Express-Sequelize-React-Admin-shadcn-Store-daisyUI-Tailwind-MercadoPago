import React, { createContext, useContext, useReducer } from "react";

// El estado inicial es un array de items en el carrito
const initialState = [];

/**
 * Reducer para manejar acciones del carrito.
 * Cada item: { id, nombre, precio, imagenUrl, cantidad, stock }
 */
function cartReducer(state, action) {
  switch (action.type) {
    case "AGREGAR_ITEM": {
      const existe = state.find(item => item.id === action.payload.id);
      if (existe) {
        // Si ya está, solo suma cantidad si no supera el stock
        return state.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                cantidad:
                  item.cantidad < item.stock
                    ? item.cantidad + 1
                    : item.cantidad,
              }
            : item
        );
      } else {
        // Nuevo item, inicia en cantidad 1
        return [
          ...state,
          { ...action.payload, cantidad: 1 },
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

  // Lógica de acciones
  const agregarAlCarrito = item => dispatch({ type: "AGREGAR_ITEM", payload: item });
  const quitarDelCarrito = id => dispatch({ type: "QUITAR_ITEM", payload: id });
  const eliminarDelCarrito = id => dispatch({ type: "ELIMINAR_ITEM", payload: id });
  const vaciarCarrito = () => dispatch({ type: "VACIAR_CARRITO" });

  // Suma total de items
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

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
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}