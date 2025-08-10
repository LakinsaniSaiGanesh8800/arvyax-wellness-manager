import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const add = useCallback((msg, opts = {}) => {
    const id = Date.now().toString()
    setToasts((t) => [...t, { id, msg, ...opts }])
    if (!opts.sticky) setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), opts.duration || 3000)
  }, [])
  const remove = useCallback((id) => setToasts((t) => t.filter(x => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-white shadow rounded p-3 border">
            <div className="text-sm">{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}