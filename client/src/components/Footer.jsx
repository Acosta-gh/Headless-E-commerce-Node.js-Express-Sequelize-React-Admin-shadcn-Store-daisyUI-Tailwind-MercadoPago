import React from 'react';

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