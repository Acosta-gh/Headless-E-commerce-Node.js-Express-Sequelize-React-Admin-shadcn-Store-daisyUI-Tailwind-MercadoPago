import { useState } from 'react'
import { loginUsuario, createUsuario } from './services/usuarioService'

function App() {
  const [form, setForm] = useState({})
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleRegistrar = async () => {
    try {
      console.log('Voy a enviar:', form)
      const response = await createUsuario(form)
      setMensaje('Usuario creado correctamente')
      console.log('Usuario creado:', response.data)
    } catch (error) {
      setMensaje('Error al crear usuario')
      console.error('Error al crear usuario:', error)
      if (error.response) {
        console.log('Respuesta del servidor:', error.response.data)
      }
    }
  }

  const handleLogin = async () => {
    try {
      const response = await loginUsuario(form)
      setMensaje('Sesión iniciada correctamente')
      console.log('Usuario logueado:', response.data)
    } catch (error) {
      setMensaje('Error al iniciar sesión')
      console.error('Error al iniciar sesión:', error)
      if (error.response) {
        console.log('Respuesta del servidor:', error.response.data)
      } else if (error.request) {
        console.log('No hubo respuesta del servidor:', error.request)
      } else {
        console.log('Error:', error.message)
      }
    }
  }

  return (
    <>

    </>
  )
}

export default App