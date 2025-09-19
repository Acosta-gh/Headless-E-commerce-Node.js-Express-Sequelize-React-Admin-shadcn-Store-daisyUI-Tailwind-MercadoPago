import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById } from "../services/itemService.js";
import { useCart } from "../context/CartContext.jsx";
import Loading from "../components/Ui/Loading.jsx";
import {
  ChevronLeft,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Item() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const prevCantidad = useRef(cantidad);
  const [animacionCantidad, setAnimacionCantidad] = useState("increase");

  const [agregado, setAgregado] = useState(false);
  const [mostrarSinStock, setMostrarSinStock] = useState(false);
  const navigate = useNavigate();
  const { agregarAlCarrito, cart } = useCart();
  const [error, setError] = useState("");

  useEffect(() => {
    if (cantidad > prevCantidad.current) {
      setAnimacionCantidad("increase");
    } else if (cantidad < prevCantidad.current) {
      setAnimacionCantidad("decrease");
    }
    prevCantidad.current = cantidad;
  }, [cantidad]);

  useEffect(() => {
    setLoading(true);
    setError("");
    getItemById(id)
      .then((response) => setItem(response.data))
      .catch((error) => {
        setError("No se pudo cargar el producto.");
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const enCarrito = useMemo(
    () => cart.find((ci) => ci.id === parseInt(id))?.cantidad || 0,
    [cart, id]
  );

  const stockDisponible = useMemo(
    () => (item ? Math.max(item.stock - enCarrito, 0) : 0),
    [item, enCarrito]
  );

  // Reinicia mostrarSinStock si hay stock disponible nuevamente
  useEffect(() => {
    if (stockDisponible > 0) setMostrarSinStock(false);
  }, [stockDisponible]);

  // Prevent cantidad from exceeding stockDisponible
  useEffect(() => {
    if (cantidad > stockDisponible) {
      setCantidad(Math.max(stockDisponible, 1));
    }
  }, [stockDisponible]);

  const incrementCantidad = () => {
    if (cantidad < stockDisponible) {
      setCantidad((prevCantidad) => prevCantidad + 1);
    }
  };

  const decrementCantidad = () => {
    if (cantidad > 1) {
      setCantidad((prevCantidad) => prevCantidad - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (cantidad > 0 && stockDisponible > 0) {
      agregarAlCarrito(
        {
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagenUrl: item.imagenUrl,
          stock: item.stock,
        },
        cantidad
      );

      setCantidad(1);
      setAgregado(true);

      // Si el stock llega a cero, muestra primero "Agregado" y luego "Sin stock"
      if (stockDisponible - cantidad <= 0) {
        setTimeout(() => {
          setAgregado(false);
          setMostrarSinStock(true);
        }, 1800);
      } else {
        setTimeout(() => setAgregado(false), 1800);
      }
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-80"
      >
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-red-600 mb-4"
        >
          {error}
        </motion.p>
      </motion.div>
    );
  if (!item)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-80"
      >
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-gray-700 mb-4"
        >
          No se encontró el item.
        </motion.p>
      </motion.div>
    );

  const notAvailable = item.stock <= 0 || item.disponible === false;

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: {
      scale: 0.95,
    },
    disabled: {
      scale: 1,
      opacity: 0.5,
    },
  };

  const counterVariants = {
    increase: { scale: [1, 1, 1], color: ["#000", "#22c55e", "#000"] },
    decrease: { scale: [1, 1, 1], color: ["#000", "#ef4444", "#000"] },
  };

  return (
    <motion.article
      className="max-w-xl mx-auto rounded-xl p-6 sm:pt-5 sm:pb-20 flex flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center mb-4" variants={itemVariants}>
        <motion.button
          onClick={() => navigate(-1)}
          className="cursor-pointer mr-2"
          style={{ minWidth: "40px" }}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft />
        </motion.button>
        <motion.div
          className="flex-1 flex justify-center relative right-6"
          variants={itemVariants}
        >
          <p className="text-center flex items-center">{item.nombre}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center"
        variants={itemVariants}
      >
        <motion.img
          src={item.imagenUrl}
          alt={item.nombre}
          className="w-64 h-64 object-cover rounded-md shadow mb-4 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        />

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-1"
          variants={itemVariants}
        >
          {item.nombre}
        </motion.h2>

        <motion.p
          className="text-gray-500 mb-3 text-center"
          variants={itemVariants}
        >
          {item.descripcion}
        </motion.p>

        <motion.div
          className="flex items-center gap-3 mb-2"
          variants={itemVariants}
        >
          <motion.span
            className="text-xl font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            {`$${item.precio}`}
          </motion.span>
          <motion.span className="text-sm text-gray-400">
            | {item.categoria?.nombre || "Sin categoría"}
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        variants={itemVariants}
      >
        {!notAvailable && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              aria-label="Quitar cantidad"
              onClick={decrementCantidad}
              disabled={cantidad <= 1}
              className={`relative bottom-[1px] bg-[var(--color-primary)] px-3.5 py-1 rounded-full text-lg font-bold text-white transition`}
              variants={buttonVariants}
              whileHover={cantidad <= 1 ? "disabled" : "hover"}
              whileTap={cantidad <= 1 ? "disabled" : "tap"}
              animate={cantidad <= 1 ? "disabled" : "visible"}
            >
              <Minus size={18} />
            </motion.button>

            <motion.span
              className="px-4 py-1  text-lg"
              key={cantidad}
              animate={animacionCantidad}
              variants={counterVariants}
              transition={{ duration: 0.3 }}
            >
              {cantidad}
            </motion.span>

            <motion.button
              aria-label="Agregar cantidad"
              onClick={incrementCantidad}
              disabled={cantidad >= stockDisponible}
              className={`relative bottom-[1px] bg-[var(--color-primary)] px-3 py-1 rounded-full text-lg font-bold text-white transition`}
              variants={buttonVariants}
              whileHover={cantidad >= stockDisponible ? "disabled" : "hover"}
              whileTap={cantidad >= stockDisponible ? "disabled" : "tap"}
              animate={cantidad >= stockDisponible ? "disabled" : "visible"}
            >
              <Plus size={18} />
            </motion.button>

            <motion.span
              className="ml-4 text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {`Stock disponible: ${stockDisponible}`}
            </motion.span>
          </motion.div>
        )}

        {notAvailable && (
          <motion.span
            className="text-red-600 font-semibold ml-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <XCircle className="inline mr-1" size={18} /> No disponible
          </motion.span>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          onClick={handleAgregarAlCarrito}
          disabled={cantidad <= 0 || notAvailable || stockDisponible <= 0}
          className={`cursor-pointer w-full h-full w-auto bg-[var(--color-primary)] text-white px-6 py-5 rounded-full font-semibold shadow transition relative overflow-hidden`}
          whileHover={
            cantidad <= 0 || notAvailable || stockDisponible <= 0
              ? {}
              : { scale: 1.03, backgroundColor: "var(--color-primary-hover)" }
          }
          whileTap={
            cantidad <= 0 || notAvailable || stockDisponible <= 0
              ? {}
              : { scale: 0.97 }
          }
          animate={
            cantidad <= 0 || notAvailable || stockDisponible <= 0
              ? { opacity: 0.7 }
              : { opacity: 1 }
          }
        >
          <AnimatePresence>
            {/* Sin stock permanente */}
            {stockDisponible <= 0 && !agregado && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-red-200 text-red-700 font-bold tracking-wide text-lg rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <XCircle className="mr-2" size={20} /> Sin stock
              </motion.div>
            )}

            {/* Agregar al carrito */}
            {stockDisponible > 0 && !agregado && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBag className="mr-2" size={20} /> Agregar al carrito
              </motion.div>
            )}

            {/* Agregado al carrito */}
            {agregado && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="mr-2" size={20} /> ¡Agregado al carrito!
              </motion.div>
            )}
          </AnimatePresence>
          <div className="opacity-0">Botón</div> {/* Espaciador invisible */}
        </motion.button>
      </motion.div>
    </motion.article>
  );
}

export default Item;
