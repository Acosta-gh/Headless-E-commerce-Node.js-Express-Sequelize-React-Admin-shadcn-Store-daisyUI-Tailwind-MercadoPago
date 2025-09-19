import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requiredRole } = {}) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div>Cargando...</div>

  if (!user) {
    // no autenticado: redirige a /login guardando la ruta actual
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredRole && user.role !== requiredRole) {
    // usuario sin el rol necesario
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
