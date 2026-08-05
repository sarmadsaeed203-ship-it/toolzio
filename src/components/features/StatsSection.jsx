import { useEffect, useState, useRef } from "react"

function AnimatedCounter({ value, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let startTimestamp = null
    const numericValue = parseFloat(value)
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(progress * numericValue)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [isVisible, value, duration])

  // format based on if it's a decimal (99.9) or integer (10)
  const isDecimal = value.toString().includes('.')
  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count)

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
      {displayValue}{suffix}
    </span>
  )
}

export function StatsSection() {
  const stats = [
    { value: "10", suffix: "M+", label: "Files Processed" },
    { value: "99.9", suffix: "%", label: "Success Rate" },
    { value: "120", suffix: "+", label: "Countries" },
    { value: "256", suffix: "-bit", label: "Encryption" },
  ]

  return (
    <section className="py-24 border-t border-[#EAEAEA] bg-muted/10">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-[#EAEAEA]/0 md:divide-[#EAEAEA]">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm font-medium text-muted-foreground mt-3 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
