/* src/pages/MySessions.jsx */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useToast } from '../components/toast'

export default function MySessions() {
  const [sessions, setSessions] = useState([])
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/my-sessions')
      .then(r => setSessions(r.data.sessions))
      .catch(e => {
        if (e.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
        }
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">My Sessions</h1>
        <Link
          to="/editor"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow transition-colors"
        >
          Create
        </Link>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow text-center text-slate-500">
            No sessions yet. Click "Create" to start a new one.
          </div>
        )}

        {sessions.map(s => (
          <div
            key={s._id}
            className="bg-white p-5 rounded-lg shadow flex justify-between items-center border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="font-semibold text-lg text-slate-800">
                {s.title}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Status: <span className="capitalize">{s.status}</span> •{' '}
                {(s.tags || []).join(', ')}
              </div>
            </div>
            <div className="space-x-2">
              <Link
                to={`/editor/${s._id}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
