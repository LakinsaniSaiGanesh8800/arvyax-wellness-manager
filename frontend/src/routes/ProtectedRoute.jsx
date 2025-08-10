import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const location = useLocation()
  if (!token) {
    console.log("No token, redirecting to /login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  console.log("Token found, allowing access")
  return children
}
