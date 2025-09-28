import React from 'react'

function Footer() {
  return (
   <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
  <nav>
    <h6 className="footer-title">Servicios</h6>
    <a className="link link-hover">Identidad de marca</a>
    <a className="link link-hover">Diseño</a>
    <a className="link link-hover">Marketing</a>
    <a className="link link-hover">Publicidad</a>
  </nav>
  <nav>
    <h6 className="footer-title">Empresa</h6>
    <a className="link link-hover">Sobre nosotros</a>
    <a className="link link-hover">Contacto</a>
    <a className="link link-hover">Empleos</a>
    <a className="link link-hover">Prensa</a>
  </nav>
  <nav>
    <h6 className="footer-title">Legal</h6>
    <a className="link link-hover">Términos y condiciones</a>
    <a className="link link-hover">Política de privacidad</a>
    <a className="link link-hover">Política de cookies</a>
    <a className="link link-hover">Defensa del consumidor</a>
    <a className="link link-hover" href="https://autogestion.produccion.gob.ar/consumidores" target="_blank" rel="noopener noreferrer">
      Dirección Nacional de Defensa del Consumidor
    </a>
  </nav>
  <form>
    <h6 className="footer-title">Newsletter</h6>
    <fieldset className="w-80">
      <label>Ingresá tu correo electrónico</label>
      <div className="join">
        <input
          type="email"
          placeholder="usuario@ejemplo.com"
          className="input input-bordered join-item" />
        <button className="btn btn-primary join-item">Suscribirse</button>
      </div>
    </fieldset>
  </form>
</footer>
  )
}

export default Footer