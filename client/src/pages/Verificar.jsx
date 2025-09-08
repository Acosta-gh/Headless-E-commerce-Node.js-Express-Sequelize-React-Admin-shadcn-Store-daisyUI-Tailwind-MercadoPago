import useVerificarMail from '../hooks/useVerificarMail';
export default function Verificar() {
  const estado = useVerificarMail();

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