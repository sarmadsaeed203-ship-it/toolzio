import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function AnalyticsProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    // 1. Google Analytics Placeholder
    // const gaId = import.meta.env.VITE_GA_ID
    // if (gaId) {
    //   console.log("GA Setup for", gaId)
    // }

    // 2. Plausible Analytics Placeholder
    // const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
    // if (plausibleDomain) {
    //   console.log("Plausible Setup for", plausibleDomain)
    // }

    // 3. Microsoft Clarity Placeholder
    // const clarityId = import.meta.env.VITE_CLARITY_ID
    // if (clarityId) {
    //   console.log("Clarity Setup for", clarityId)
    // }

  }, [])

  useEffect(() => {
    // Track page views on route change
    // e.g. window.gtag('config', import.meta.env.VITE_GA_ID, { page_path: location.pathname })
  }, [location])

  return <>{children}</>
}
