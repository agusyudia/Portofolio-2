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

export default function Education({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()

  if (!data) return null

  const { education, certifications } = data

  return (
    <section id="education" className={`py-24 px-6 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50/80'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Background
          </p>
          <h2 className={`text-4xl md:text-5xl font-extrabold section-title-line ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Education & Certifications
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Education */}
          <div>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2
              ${isDark ? 'text-white' : 'text-slate-900'}
            `}>
              <span className="text-2xl">🎓</span> Education
            </h3>
            <div className="flex flex-col gap-4">
              {education.map(edu => (
                <div
                  key={edu.id}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                    ${isDark
                      ? 'glass-dark hover:border-blue-500/30 hover:shadow-blue-500/10'
                      : 'glass-light shadow-sm hover:shadow-blue-100'
                    }
                  `}
                >
                  <div className={`text-xs font-semibold tracking-widest uppercase mb-1
                    ${isDark ? 'text-blue-400' : 'text-blue-600'}
                  `}>
                    {edu.period}
                  </div>
                  <h4 className={`text-lg font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {edu.degree}
                  </h4>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {edu.field}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {edu.institution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2
              ${isDark ? 'text-white' : 'text-slate-900'}
            `}>
              <span className="text-2xl">🏅</span> Certifications
            </h3>
            <div className="flex flex-col gap-4">
              {certifications.map(cert => (
                <div
                  key={cert.id}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                    ${isDark
                      ? 'glass-dark hover:border-blue-500/30 hover:shadow-blue-500/10'
                      : 'glass-light shadow-sm hover:shadow-blue-100'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{cert.icon}</span>
                    <div>
                      <div className={`text-xs font-semibold tracking-widest uppercase mb-1
                        ${isDark ? 'text-blue-400' : 'text-blue-600'}
                      `}>
                        {cert.period}
                      </div>
                      <h4 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {cert.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {cert.issuer}
                      </p>
                      {cert.detail && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {cert.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
