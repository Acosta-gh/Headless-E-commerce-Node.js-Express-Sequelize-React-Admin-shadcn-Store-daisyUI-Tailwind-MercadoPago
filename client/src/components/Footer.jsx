import React from 'react'

function Footer() {
    return (
        <footer style={{ background: "#222", color: "#fff", padding: "2rem 0", textAlign: "center" }}>
            <div>
                <p>&copy; {new Date().getFullYear()} Restaurante. Todos los derechos reservados.</p>
                <p>
                    <a href="mailto:contacto@restaurante.com" style={{ color: "#fff", textDecoration: "underline" }}>
                        contacto@restaurante.com
                    </a>
                </p>
                <p>
                    Síguenos en&nbsp;
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>
                        Facebook
                    </a>
                    &nbsp;|&nbsp;
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#fff" }}>
                        Instagram
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer