import { useCallback, useSyncExternalStore } from "react"

const STORAGE_EVENT = "mockify-storage-update"

function dispatchStorageUpdate() {
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

export function useLocalStorageItem<T>(
  key: string,
  defaultValue: T,
  parse: (raw: string) => T,
  serialize: (value: T) => string
): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) callback()
      }
      const onCustom = () => callback()
      window.addEventListener("storage", onStorage)
      window.addEventListener(STORAGE_EVENT, onCustom)
      return () => {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener(STORAGE_EVENT, onCustom)
      }
    },
    [key]
  )

  const getSnapshot = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return parse(raw)
    } catch {
      /* ignore corrupt localStorage */
    }
    return defaultValue
  }, [key, defaultValue, parse])

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue)

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = getSnapshot()
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next
      try {
        localStorage.setItem(key, serialize(resolved))
        dispatchStorageUpdate()
      } catch {
        /* ignore quota errors */
      }
    },
    [key, serialize, getSnapshot]
  )

  return [value, setValue]
}
