import { useEffect, useState } from 'react';

export default function Verificar() {
  const [estado, setEstado] = useState({
    cargando: true,
    mensaje: 'Verificando...',
    exito: false
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let token = params.get('token');

    if (!token) {
      setEstado({ cargando: false, mensaje: 'Falta el token en la URL.', exito: false });
      return;
    }

    token = token.replace(/\?+$/, '');

    fetch(`http://localhost:3000/api/usuario/verify?token=${encodeURIComponent(token)}`)
      .then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          setEstado({
            cargando: false,
            mensaje: data.message || 'Error verificando token.',
            exito: false
          });
          return;
        }
        setEstado({
          cargando: false,
          mensaje: data.message || 'Cuenta verificada.',
          exito: true
        });
      })
      .catch(() => {
        setEstado({ cargando: false, mensaje: 'Error de red verificando token.', exito: false });
      });
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="bg-white shadow rounded p-6 max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-semibold">Verificación de cuenta</h1>
        <p className={estado.exito ? 'text-green-700' : 'text-gray-700'}>
          {estado.mensaje}
        </p>
        {estado.cargando && <div className="text-sm text-gray-500">Procesando...</div>}
        {!estado.cargando && estado.exito && (
          <a href="/perfil" className="inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded font-medium">
            Iniciar sesión
          </a>
        )}
        {!estado.cargando && !estado.exito && (
          <a href="/perfil" className="inline-block text-blue-600 underline">
            Volver al login
          </a>
        )}
      </div>
    </div>
  );
}