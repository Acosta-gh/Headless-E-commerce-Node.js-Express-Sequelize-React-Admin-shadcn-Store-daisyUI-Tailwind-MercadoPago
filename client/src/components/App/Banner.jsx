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
          2xl:max-w-xl 2xl:left-32 2xl:top-1/4"
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
        className="absolute right-[15rem] top-[1.5rem] z-10 w-full max-w-20xl px-4
          md:right-12 md:top-[2rem] md:max-w-md 
          lg:right-[10rem] lg:top-4 lg:max-w-2xl lg:top-[1.8rem]
          2xl:right-[15rem] 2xl:top-[1rem] 2xl:max-w-6xl
         
         flex flex-row justify-between items-center gap-8
          
          "
      >
        <p className="text-end text-white font-playfair text-7xl font-medium drop-shadow-lg
          md:text-4xl md:text-end 
          lg:text-5xl
          2xl:text-7xl
          flex-2  
          "
        >
          <span className="font-bold ">"Vive Sano"</span>: Platos Sabrosos y Saludables
        </p>
        <div>
          <p className="text-end text-white font-playfair ml-5 drop-shadow-lg 
"
          >
            Con <span className="font-bold">4.5 Estrellas</span> en
            <a
              href="https://www.yelp.com/"
              className="
                font-bold ml-1
                underline decoration-[3px] decoration-[var(--color-accent)] text-[var(--color-accent)]
              "
            >
              Yelp!
            </a>
            !
          </p>
          <div className="flex flex-row justify-end items-center gap-2 mt-2">
            <svg
              className="w-[20px] h-[20px]"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <svg
              className="w-[20px] h-[20px]"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <svg
              className="w-[20px] h-[20px]"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <svg
              className="w-[20px] h-[20px]"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <svg
              className="w-[20px] h-[20px]"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path fill-rule="evenodd" d="M13 4.024v-.005c0-.053.002-.353-.217-.632a1.013 1.013 0 0 0-1.176-.315c-.192.076-.315.193-.35.225-.052.05-.094.1-.122.134a4.358 4.358 0 0 0-.31.457c-.207.343-.484.84-.773 1.375a168.719 168.719 0 0 0-1.606 3.074h-.002l-4.599.367c-1.775.14-2.495 2.339-1.143 3.488L6.17 15.14l-1.06 4.406c-.412 1.72 1.472 3.078 2.992 2.157l3.94-2.388c.592-.359.958-.996.958-1.692v-13.6Zm-2.002 0v.025-.025Z" clip-rule="evenodd" />
            </svg>

          </div>

        </div>
      </motion.div>

      {/* Imagen del plato */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-1/8 right-32 max-w-2xl z-10
          md:right-20 md:max-w-sm md:top-1/5 
          lg:right-8 lg:max-w-md lg:top-25 lg:right-25
          2xl:right-1/7 2xl:max-w-3xl 2xl:top-1/7"
      >
        <img src="plato.png" alt="Plato" className="w-full h-auto" />
      </motion.div>

      {/* Fondo svg */}
      <div className="flex flex-col w-full ">
        {/* Esto es con el unico proposito de agregar espacio antes del wave */}
        <div className="bg-[var(--color-primary)] h-50 w-full">
        </div>
        <svg id="visual" viewBox="0 0 960 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 181L40 179.3C80 177.7 160 174.3 240 168C320 161.7 400 152.3 480 143.8C560 135.3 640 127.7 720 134.2C800 140.7 880 161.3 920 171.7L960 182L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z" fill="#283f0f"></path><path d="M0 149L40 136.7C80 124.3 160 99.7 240 93C320 86.3 400 97.7 480 99.7C560 101.7 640 94.3 720 91.7C800 89 880 91 920 92L960 93L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z" fill="#1d350f"></path><path d="M0 62L40 69.3C80 76.7 160 91.3 240 89.7C320 88 400 70 480 69.2C560 68.3 640 84.7 720 93.8C800 103 880 105 920 106L960 107L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z" fill="#132b0e"></path><path d="M0 39L40 38C80 37 160 35 240 39.2C320 43.3 400 53.7 480 55.8C560 58 640 52 720 51.8C800 51.7 880 57.3 920 60.2L960 63L960 0L920 0C880 0 800 0 720 0C640 0 560 0 480 0C400 0 320 0 240 0C160 0 80 0 40 0L0 0Z" fill="#0c220b"></path></svg>        </div>
    </motion.div>
  );
}

export default Banner;