/**
 * UnlockContext — broadcasts a one-time "unlocked" event so HeroSection
 * can animate its title in sync with the PasswordGate transition.
 */
import { createContext, useContext, useRef, useCallback } from "react";

type Listener = () => void;

interface UnlockContextValue {
  onUnlock: (fn: Listener) => () => void;
  fireUnlock: () => void;
}

const UnlockContext = createContext<UnlockContextValue>({
  onUnlock: () => () => {},
  fireUnlock: () => {},
});

export function UnlockProvider({ children }: { children: React.ReactNode }) {
  const listeners = useRef<Set<Listener>>(new Set());

  const onUnlock = useCallback((fn: Listener) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  const fireUnlock = useCallback(() => {
    listeners.current.forEach((fn) => fn());
  }, []);

  return (
    <UnlockContext.Provider value={{ onUnlock, fireUnlock }}>
      {children}
    </UnlockContext.Provider>
  );
}

export const useUnlock = () => useContext(UnlockContext);
