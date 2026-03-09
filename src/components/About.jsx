import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function useInView(threshold = 0.05) {
  const ref = useRef()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

export default function About({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()

  if (!data) return null
  const { personal } = data

  const cards = [
    {
      icon: '🌏',
      label: 'Location',
      value: personal.location,
    },
    {
      icon: '✉️',
      label: 'Email',
      value: personal.email,
    },
    {
      icon: '📱',
      label: 'Phone',
      value: personal.phone,
    },
    {
      icon: '💼',
      label: 'Status',
      value: 'Open to opportunities',
    },
  ]

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            About Me
          </p>
          <h2 className={`text-4xl md:text-5xl font-extrabold section-title-line ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Professional Summary
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left: Photo + summary */}
          <div>
            {/* Profile photo */}
            <div className="relative mb-8 inline-block">
              {personal.photo ? (
                <div className="relative">
                  <img
                    src={personal.photo}
                    alt={personal.name}
                    className="w-36 h-36 rounded-2xl object-cover object-bottom shadow-2xl shadow-blue-500/30"
                    style={{ border: '2px solid rgba(59,130,246,0.3)' }}
                  />
                  {/* Glow border overlay */}
                  <div className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow: '0 0 30px rgba(59,130,246,0.25), inset 0 0 0 1px rgba(59,130,246,0.2)' }}
                  />
                </div>
              ) : (
                <div className={`w-36 h-36 rounded-2xl flex items-center justify-center text-5xl font-extrabold
                  bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/30`}>
                  AY
                </div>
              )}
              {/* Online badge */}
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-400 border-4 flex items-center justify-center
                ${isDark ? 'border-slate-900' : 'border-white'}
              `}>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {personal.name}
            </h3>
            <p className={`text-base font-medium mb-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {personal.title}
            </p>

            <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {personal.summary}
            </p>
          </div>

          {/* Right: Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                  ${isDark
                    ? 'glass-dark hover:border-blue-500/30'
                    : 'glass-light hover:border-blue-300 shadow-sm'
                  }
                `}
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className={`text-xs font-semibold tracking-widest uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {card.label}
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
