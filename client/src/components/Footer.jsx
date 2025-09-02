import React from 'react';

/**
 * Componente Footer
 *
 * Renderiza el pie de página del sitio web del restaurante, mostrando el año actual,
 * un correo de contacto y enlaces a redes sociales (Facebook e Instagram).
 * Solo es visible en pantallas medianas o mayores (md y superiores).
 *
 * @component
 * @returns {JSX.Element} El elemento JSX que representa el pie de página.
 */
function Footer() {
    return (
        <footer className="hidden md:block bg-[var(--color-secondary)] text-white py-8 text-center">
            <div>
                <p>&copy; {new Date().getFullYear()} Restaurante. Todos los derechos reservados.</p>
                <p>
                    <a
                        href="mailto:contacto@restaurante.com"
                        className="underline text-white"
                    >
                        contacto@restaurante.com
                    </a>
                </p>
                <p>
                    Síguenos en&nbsp;
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-blue-400"
                    >
                        Facebook
                    </a>
                    &nbsp;|&nbsp;
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-pink-400"
                    >
                        Instagram
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;