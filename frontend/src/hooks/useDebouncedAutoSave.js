import { useEffect, useRef } from 'react'

export default function useDebouncedAutoSave(value, callback, delay = 5000) {
  const timer = useRef(null)
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(), delay)
    return () => clearTimeout(timer.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
}