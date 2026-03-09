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

function SkillBar({ name, level, isDark, animate }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {name}
        </span>
        <span className={`text-xs font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {level}%
        </span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div
          className="skill-bar-fill"
          style={{ width: animate ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  )
}

function SkillCategory({ title, icon, skills, isDark, animate }) {
  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${isDark
          ? 'glass-dark hover:border-blue-500/30 hover:shadow-blue-500/10'
          : 'glass-light shadow-sm hover:shadow-blue-100 hover:border-blue-200'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      </div>
      {skills.map(skill => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          level={skill.level}
          isDark={isDark}
          animate={animate}
        />
      ))}
    </div>
  )
}

export default function Skills({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()

  if (!data) return null
  const { skills } = data

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Tech Stack
          </p>
          <h2 className={`text-4xl md:text-5xl font-extrabold section-title-line ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Skills
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <SkillCategory
            title="Languages"
            icon="⌨️"
            skills={skills.languages}
            isDark={isDark}
            animate={inView}
          />
          <SkillCategory
            title="Frameworks"
            icon="🚀"
            skills={skills.frameworks}
            isDark={isDark}
            animate={inView}
          />
          <SkillCategory
            title="Tools & Platforms"
            icon="🛠️"
            skills={skills.tools}
            isDark={isDark}
            animate={inView}
          />
        </div>

        {/* Soft skills */}
        <div className={`mt-8 p-6 rounded-2xl
          ${isDark ? 'glass-dark' : 'glass-light shadow-sm'}
        `}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🤝</span>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Soft Skills
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.soft.map(s => (
              <span
                key={s}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105
                  ${isDark
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-300'
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700'
                  }
                `}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
