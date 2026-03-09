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

const CATEGORIES = ['All', 'WordPress', 'Web App', 'Government']

function ProjectCard({ project, isDark, index, visible }) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500
        hover:-translate-y-2 hover:shadow-2xl
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${isDark
          ? 'glass-dark hover:border-blue-500/40 hover:shadow-blue-500/10'
          : 'glass-light shadow-md hover:shadow-blue-200 hover:border-blue-200'
        }
      `}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* Top gradient banner */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden" style={{ background: project.gradient }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

        <span className="text-5xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {project.icon}
        </span>

        {/* Year badge */}
        <span className="absolute top-4 right-4 text-xs font-bold text-white/80 bg-black/20 px-2 py-1 rounded-full">
          {project.year}
        </span>

        {/* Category badge */}
        <span className="absolute bottom-4 left-4 text-xs font-semibold text-white bg-black/25 px-3 py-1 rounded-full backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {project.title}
        </h3>
        <p className={`text-sm leading-relaxed flex-1 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {project.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map(tech => (
            <span
              key={tech}
              className={`text-xs px-2 py-0.5 rounded-md font-medium
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

        {/* Link button */}
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-semibold
              text-blue-500 hover:text-blue-400 transition-colors
            `}
          >
            View Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            🔒 Private / Client Project
          </span>
        )}
      </div>
    </div>
  )
}

export default function Portfolio({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()
  const [activeCategory, setActiveCategory] = useState('All')

  if (!data) return null
  const { portfolio } = data

  const filtered = activeCategory === 'All'
    ? portfolio
    : portfolio.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            My Work
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className={`text-4xl md:text-5xl font-extrabold section-title-line ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Portfolio
            </h2>

            {/* Category filter */}
            <div className={`flex flex-wrap gap-2`}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${activeCategory === cat
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                      : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDark={isDark}
              index={i}
              visible={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
