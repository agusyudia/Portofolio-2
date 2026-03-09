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

function ExperienceCard({ exp, index, isDark }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 transition-all duration-700 delay-${(index % 4) * 100}
        ${visible ? 'opacity-100 translate-x-0' : `opacity-0 ${isEven ? '-translate-x-8' : 'translate-x-8'}`}
      `}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center mt-1.5 flex-shrink-0">
        <div className={`w-4 h-4 rounded-full border-2 z-10 flex-shrink-0
          bg-gradient-to-br from-blue-500 to-cyan-400
          border-transparent
          shadow-lg shadow-blue-500/40
        `} />
        <div className={`w-0.5 flex-1 mt-2 min-h-[60px]
          ${isDark ? 'bg-blue-500/20' : 'bg-blue-200'}
        `} />
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-8 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          ${isDark
            ? 'glass-dark hover:border-blue-500/30 hover:shadow-blue-500/10'
            : 'glass-light hover:border-blue-300 shadow-sm hover:shadow-blue-100'
          }
        `}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {exp.role}
            </h3>
            <p className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {exp.company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-3 py-1 rounded-full font-medium
              ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}
            `}>
              {exp.period}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${exp.type === 'Contract'
                ? isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'
                : isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-600'
              }
            `}>
              {exp.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {exp.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-2">
          {exp.stack.map(tech => (
            <span
              key={tech}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium
                ${isDark
                  ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                }
              `}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()

  if (!data) return null

  // Sort by most recent first
  const sorted = [...data.experience].sort((a, b) => b.id - a.id)

  return (
    <section id="experience" className={`py-24 px-6 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50/80'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Career Path
          </p>
          <h2 className={`text-4xl md:text-5xl font-extrabold section-title-line ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Experience
          </h2>
        </div>

        <div ref={ref}>
          {sorted.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  )
}
