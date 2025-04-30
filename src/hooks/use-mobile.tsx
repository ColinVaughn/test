
import * as React from "react"
import { createContext, useContext } from "react"

type MobileContextType = {
  isMobile: boolean;
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

const MOBILE_BREAKPOINT = 768

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useIsMobile() {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useIsMobile must be used within a MobileProvider");
  }
  return context.isMobile;
}
