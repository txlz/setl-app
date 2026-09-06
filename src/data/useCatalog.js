import { useCallback, useEffect, useRef, useState } from 'react'
import { loadCatalog, saveCatalog, resetCatalog, reorder } from './catalog.js'

// Shared subscription to the admin-owned catalogue. Any screen using this
// re-renders when admin changes the arrangement — including the customer
// Home screen, which is the whole point.
export function useCatalog() {
  const [cats, setCats] = useState(loadCatalog)

  // The updater below must stay pure (React can run it twice), so it only
  // records what to persist; the effect does the actual write.
  const pending = useRef(null)
  const [writes, setWrites] = useState(0)

  useEffect(() => {
    if (pending.current) {
      saveCatalog(pending.current)
      pending.current = null
    }
  }, [writes])

  useEffect(() => {
    const sync = () => setCats(loadCatalog())
    // Same tab (our own writes) and other tabs (the `storage` event).
    window.addEventListener('setl_catalog_change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('setl_catalog_change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Derive from the latest state rather than a captured snapshot, so two
  // edits in the same tick can't clobber each other.
  const commit = useCallback((fn) => {
    setCats((prev) => {
      const next = fn(prev)
      pending.current = next
      return next
    })
    setWrites((n) => n + 1)
  }, [])

  const toggle = useCallback(
    (id, field) => commit((cs) => cs.map((c) => (c.id === id ? { ...c, [field]: !c[field] } : c))),
    [commit],
  )

  const setIcon = useCallback(
    (id, slug) => commit((cs) => cs.map((c) => (c.id === id ? { ...c, icon: slug || null } : c))),
    [commit],
  )

  const move = useCallback((id, dir) => commit((cs) => reorder(cs, id, dir)), [commit])

  const reset = useCallback(() => resetCatalog(), [])

  return { cats, toggle, setIcon, move, reset }
}
