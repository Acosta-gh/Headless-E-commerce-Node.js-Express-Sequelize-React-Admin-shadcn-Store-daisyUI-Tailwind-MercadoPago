import React from "react";
import { motion } from "framer-motion";

function Banner() {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // cubic-bezier para suavidad
      }}
      className="hidden sm:block w-full overflow-hidden leading-none relative"
    >
      <div className="absolute top-1/4 left-32 max-w-xl z-10">
        <p className="text-start text-white leading-relaxed mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quidem quia exercitationem unde impedit sint sed numquam vel sequi, facilis totam ipsam harum asperiores accusantium dignissimos ipsa commodi rerum fugit.
        </p>
        <div className="flex gap-4">
          <button className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full cursor-pointer">
            Botón 1
          </button>
          <button className="bg-white text-[var(--color-accent)] px-6 py-2 rounded-full border border-[var(--color-accent)] cursor-pointer">
            Botón 2
          </button>
        </div>
      </div>
      <div className="absolute top-1/8 right-32 max-w-2xl z-10">
        <img src="plato.png"></img>
      </div>

      <h1 className="absolute top-10 right-64 text-6xl font-bold text-white z-20 font-italiana">
        Lorem, ipsum dolor.
      </h1>

      <svg
        id="wave"
        className="w-full"
        style={{ transform: "rotate(180deg)", transition: "0.3s" }}
        viewBox="0 0 1440 490"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
            <stop stopColor="rgba(12, 34, 11, 1)" offset="0%" />
            <stop stopColor="rgba(12, 34, 11, 1)" offset="100%" />
          </linearGradient>
        </defs>
        <path
          style={{ transform: "translate(0, 0px)", opacity: 1 }}
          fill="url(#sw-gradient-0)"
          d="M0,343L120,302.2C240,261,480,180,720,155.2C960,131,1200,163,1440,196C1680,229,1920,261,2160,285.8C2400,310,2640,327,2880,294C3120,261,3360,180,3600,130.7C3840,82,4080,65,4320,73.5C4560,82,4800,114,5040,122.5C5280,131,5520,114,5760,147C6000,180,6240,261,6480,294C6720,327,6960,310,7200,253.2C7440,196,7680,98,7920,114.3C8160,131,8400,261,8640,310.3C8880,359,9120,327,9360,302.2C9600,278,9840,261,10080,277.7C10320,294,10560,343,10800,310.3C11040,278,11280,163,11520,114.3C11760,65,12000,82,12240,73.5C12480,65,12720,33,12960,16.3C13200,0,13440,0,13680,8.2C13920,16,14160,33,14400,81.7C14640,131,14880,212,15120,220.5C15360,229,15600,163,15840,155.2C16080,147,16320,196,16560,245C16800,294,17040,343,17160,367.5L17280,392L17280,490L17160,490C17040,490,16800,490,16560,490C16320,490,16080,490,15840,490C15600,490,15360,490,15120,490C14880,490,14640,490,14400,490C14160,490,13920,490,13680,490C13440,490,13200,490,12960,490C12720,490,12480,490,12240,490C12000,490,11760,490,11520,490C11280,490,11040,490,10800,490C10560,490,10320,490,10080,490C9840,490,9600,490,9360,490C9120,490,8880,490,8640,490C8400,490,8160,490,7920,490C7680,490,7440,490,7200,490C6960,490,6720,490,6480,490C6240,490,6000,490,5760,490C5520,490,5280,490,5040,490C4800,490,4560,490,4320,490C4080,490,3840,490,3600,490C3360,490,3120,490,2880,490C2640,490,2400,490,2160,490C1920,490,1680,490,1440,490C1200,490,960,490,720,490C480,490,240,490,120,490L0,490Z"
        ></path>
      </svg>
    </motion.div>
  );
}

export default Banner;