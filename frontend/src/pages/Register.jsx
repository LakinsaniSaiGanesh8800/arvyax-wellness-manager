/* src/pages/Register.jsx */
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import { useToast } from '../components/toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/auth/register', { email, password })
      toast.add('Registered — please log in')
      navigate('/login')
    } catch (err) {
      toast.add(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Register'}
            </button>
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
