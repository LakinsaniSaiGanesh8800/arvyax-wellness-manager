/* src/App.jsx */
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MySessions from './pages/MySessions'
import SessionEditor from './pages/SessionEditor'
import ProtectedRoute from './routes/ProtectedRoute'
import GuestRoute from './routes/GuestRoute'
import ToastProvider from './components/toast'

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-lg">
              Arvyax Wellness
            </Link>
            <nav className="space-x-4">
              <Link to="/" className="text-sm">Home</Link>
              <Link to="/my-sessions" className="text-sm">My Sessions</Link>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/my-sessions"
              element={
                <ProtectedRoute>
                  <MySessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id?"
              element={
                <ProtectedRoute>
                  <SessionEditor />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}
