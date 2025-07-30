import React from "react";
import { motion } from "framer-motion";

function Banner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex w-full overflow-hidden leading-none relative"
    >
      {/* Texto de introducción */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-1/5 left-32 max-w-xl z-10
          md:left-16 md:max-w-[250px] md:top-1/6
          lg:max-w-md lg:left-16 
          2xl:max-w-xl 2xl:left-32 2xl:top-1/5"
      >
        <p className="text-start text-white leading-relaxed mb-6 text-xl
          md:text-sm md:mb-4
          lg:text-base
          2xl:text-xl"
        >
          Rico y sano parece un sueño, pero con <span className="font-bold">"Vive Sano"</span> es una realidad. Descubre nuestra variedad de platos saludables y deliciosos que te harán sentir bien por dentro y por fuera.
          </p>
        <div className="flex gap-4">
          <button className="bg-[var(--color-accent)] text-white px-8 py-4 rounded-full cursor-pointer
            md:px-3 md:py-1.5 md:text-sm
            lg:px-4 lg:py-2 lg:text-sm
            2xl:px-8 2xl:py-4 2xl:text-base"
          >
            Comienza Ahora
          </button>
        </div>
      </motion.div>
      {/* Titulo */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute right-[15rem] top-[1.5rem] z-10 w-full max-w-4xl px-4
          md:right-12 md:top-[2rem] md:max-w-md 
          lg:right-[10rem] lg:top-4 lg:max-w-2xl lg:top-[1.8rem]
          2xl:right-[15rem] 2xl:top-[1rem] 2xl:max-w-4xl"
      >
        <p className="text-end text-white font-playfair text-7xl font-medium drop-shadow-lg
          md:text-4xl md:text-end 
          lg:text-5xl
          2xl:text-7xl"
        >
          <span className="font-bold ">"Vive Sano"</span>: Platos Sabrosos y Saludables
        </p>
      </motion.div>
      
      {/* Imagen del plato */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-1/8 right-32 max-w-2xl z-10
          md:right-20 md:max-w-sm md:top-1/5 
          lg:right-8 lg:max-w-md lg:top-25 lg:right-25
          2xl:right-1/5 2xl:max-w-2xl 2xl:top-1/7"
      >
        <img src="plato.png" alt="Plato" className="w-full h-auto" />
      </motion.div>

      {/* Fondo svg */}
      <div className="flex flex-col w-full ">
        {/* Esto es con el unico proposito de agregar espacio antes del wave */}
        <div className="bg-[var(--color-primary)] h-50 w-full">
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0C220B" fill-opacity="10" d="M0,288L80,272C160,256,320,224,480,176C640,128,800,64,960,74.7C1120,85,1280,171,1360,213.3L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      </div>

    </motion.div>
  );
}

export default Banner;