import React from "react";

function Hero() {
  return (
    <div
      className="hero min-h-screen relative"
      style={{
        backgroundImage:
          "url(https://scontent.fbhi10-1.fna.fbcdn.net/v/t39.30808-6/480297729_671017651933057_1426411239251009772_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=n8XEl1WAM38Q7kNvwEsD1MR&_nc_oc=AdlItCqfVkwok3wbsb8BThifoXD6FYaMl4CS6_pJvr17p5muItC35Tj5j_Qyztm7mts&_nc_zt=23&_nc_ht=scontent.fbhi10-1.fna&_nc_gid=GhdaRgIaKImnxzFtOc1AkA&oh=00_AfbvLUJ_kTcz5dCLkcgk5_R5RTXY-0i0a8qhQe8IjamOaQ&oe=68DEAD53)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay blurred */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="hero-content text-neutral-content text-center relative z-1">
        <div className="max-w-md mx-auto">
          <h1 className="mb-5 text-5xl font-bold">Mueblería CKS</h1>
          <p className="mb-5">
            Bienvenido a <b>Mueblería CKS</b> de Guaminí.
            <br />
            Encontrá los mejores muebles para tu hogar, oficina o empresa.
            <br />
            Calidad, diseño y atención personalizada desde el corazón de Guaminí.
          </p>
          <button className="btn btn-neutral">Ver catálogo</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;