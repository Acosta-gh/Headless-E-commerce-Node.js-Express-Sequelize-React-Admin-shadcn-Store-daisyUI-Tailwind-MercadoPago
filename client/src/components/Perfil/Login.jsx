import { useState } from 'react'
import { loginUsuario } from '../../services/usuarioService'
import { useAuth } from "../../context/AuthContext"

function Login({ setIsSigningUp, setIsLoggedIn }) {
  const [form, setForm] = useState({})
  const { refreshAuth } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault()
    loginUsuario(form)
      .then(response => {
        console.log('Usuario logueado:', response.data)
        localStorage.setItem('token', response.data.token)
        setIsLoggedIn(true) 
        refreshAuth(); 
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error)
        if (error.response) {
          console.log('Respuesta del servidor:', error.response.data)
        } else if (error.request) {
          console.log('No hubo respuesta del servidor:', error.request)
        } else {
          console.log('Error:', error.message)
        }
      })

  }

  return (
    <div className=" flex items-center justify-center ">
      <div className=" p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-secondary)] text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <a
            onClick={() => setIsSigningUp(true)}
            className="text-blue-600 hover:underline"
            style={{ cursor: "pointer" }}
          >
            Regístrate acá
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login