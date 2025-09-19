import React, { createContext, useContext, useReducer, useEffect } from "react";

// Estado inicial: carga desde localStorage si existe
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

      // Validar cantidad
      if (isNaN(cantidadToAdd) || cantidadToAdd <= 0) {
        console.error("Cantidad inválida:", cantidad);
        return state;
      }

      const existe = state.find(cartItem => cartItem.id === item.id);

      if (existe) {
        // Sumar cantidad, no exceder stock
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
        // Nuevo item, limitar por stock
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

// Contexto
const CartContext = createContext();

// Hook
export const useCart = () => useContext(CartContext);

// Provider
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Acciones
  const agregarAlCarrito = (item, cantidad = 1) => {
    dispatch({
      type: "AGREGAR_ITEM",
      payload: { item, cantidad }
    });
  };

  const quitarDelCarrito = id =>
    dispatch({ type: "QUITAR_ITEM", payload: id });

  const eliminarDelCarrito = id =>
    dispatch({ type: "ELIMINAR_ITEM", payload: id });

  const vaciarCarrito = () =>
    dispatch({ type: "VACIAR_CARRITO" });

  // Número total de ítems únicos
  const totalItems = cart.length;

  // Suma total de cantidades
  const totalItemQuantity = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Precio total
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
        totalItemQuantity,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}