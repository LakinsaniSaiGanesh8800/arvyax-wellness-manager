/* src/pages/Dashboard.jsx */
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    API.get('/sessions')
      .then(r => setSessions(r.data.sessions))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-2">
        Published Sessions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.length === 0 && (
          <div className="col-span-full text-center text-slate-500 italic">
            No sessions yet
          </div>
        )}

        {sessions.map(s => (
          <div
            key={s._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-5 border border-slate-200"
          >
            <h3 className="text-lg font-semibold text-slate-800 truncate">
              {s.title}
            </h3>
            <div className="text-sm text-slate-500 mt-1">
              By: {s.user_id?.email || 'Unknown'}
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-slate-600 italic truncate">
                {(s.tags || []).join(', ')}
              </div>
              <Link
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                to={`/editor/${s._id}`}
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
