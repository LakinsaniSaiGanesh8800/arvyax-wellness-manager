/* src/pages/Login.jsx */
import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import API from '../services/api'
import { useToast } from '../components/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const from = location.state?.from?.pathname || '/my-sessions'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      toast.add('Logged in')
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      toast.add(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Login'}
            </button>
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
