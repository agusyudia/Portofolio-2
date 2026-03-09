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

export default function Contact({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, inView] = useInView()

  if (!data) return null
  const { personal } = data

  const contacts = [
    {
      icon: '✉️',
      label: 'Email',
      value: personal.email,
      href: `mailto:${personal.email}`,
    },
    {
      icon: '📱',
      label: 'WhatsApp',
      value: personal.phone,
      href: `https://wa.me/${personal.phone.replace(/[-\s]/g, '')}`,
    },
    {
      icon: '📍',
      label: 'Location',
      value: personal.location,
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Get In Touch
          </p>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            I'm currently open to new opportunities. Whether you have a project in mind or just want to say hi, feel free to reach out!
          </p>
        </div>

        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Contact cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {contacts.map((c, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group
                  ${isDark
                    ? 'glass-dark hover:border-blue-500/40 hover:shadow-blue-500/10'
                    : 'glass-light shadow-sm hover:shadow-blue-100 hover:border-blue-200'
                  }
                `}
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className={`text-xs font-semibold tracking-widest uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {c.label}
                </div>
                {c.href ? (
                  <a
                    href={c.href}
                    className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`}
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {c.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <a
            href={`mailto:${personal.email}`}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-base text-white
              bg-gradient-to-r from-blue-600 to-cyan-500
              hover:from-blue-500 hover:to-cyan-400
              shadow-2xl shadow-blue-500/30
              transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            <span>✉️</span>
            Send me an email
          </a>

          {/* Divider */}
          <div className={`my-12 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Footer note */}
          <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Designed & Built by{' '}
            <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              I Putu Agus Yudi Artawan
            </span>{' '}
            · Bali, Indonesia
          </p>
        </div>
      </div>
    </section>
  )
}
