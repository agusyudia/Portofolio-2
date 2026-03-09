import { useEffect, useState, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

function TypeWriter({ texts, speed = 80 }) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        if (charIndex === 0) {
          setIsDeleting(false)
          setTextIndex(i => (i + 1) % texts.length)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, speed])

  return (
    <span>
      {displayText}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  )
}

export default function Hero({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!data) return null

  const typeTexts = [
    'Frontend Web Developer',
    'Vue.js / React.js Engineer',
    'UI/UX Enthusiast',
    'Nuxt.js Developer',
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Background gradient blob */}
      <div className={`absolute inset-0 pointer-events-none`}>
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20
            ${isDark ? 'bg-blue-600' : 'bg-blue-300'}
          `}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10
            ${isDark ? 'bg-purple-600' : 'bg-cyan-300'}
          `}
        />
      </div>

      <div
        className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase
              ${isDark
                ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                : 'bg-blue-50 border border-blue-200 text-blue-600'
              }
            `}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for Work
          </span>
        </div>

        {/* Name */}
        <h1 className={`text-5xl md:text-7xl font-extrabold mb-4 tracking-tight leading-tight
          ${isDark ? 'text-white' : 'text-slate-900'}
        `}>
          I Putu Agus {' '}
          <span className="gradient-text"> Yudi Artawan</span>
        </h1>

        {/* Typewriter */}
        <p className={`text-2xl md:text-3xl font-semibold mb-6 h-10
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          <TypeWriter texts={typeTexts} />
        </p>

        {/* Summary snippet */}
        <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed
          ${isDark ? 'text-slate-400' : 'text-slate-500'}
        `}>
          5 years building fast, responsive, and SEO-optimized web applications.
          Certified by <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>BNSP</span> · Based in Bali, Indonesia
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#experience"
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white
              bg-gradient-to-r from-blue-600 to-cyan-500
              hover:from-blue-500 hover:to-cyan-400
              shadow-lg shadow-blue-500/30
              transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className={`px-8 py-3.5 rounded-full font-semibold text-sm
              border transition-all duration-300 hover:scale-105
              ${isDark
                ? 'border-blue-500/40 text-slate-300 hover:border-blue-400 hover:text-white hover:bg-blue-500/10'
                : 'border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            Contact Me
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16">
          {[
            { value: '5+', label: 'Years Exp.' },
            { value: '7+', label: 'Companies' },
            { value: '10+', label: 'Frameworks' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl font-extrabold gradient-text`}>{stat.value}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <div className={`flex flex-col items-center gap-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className="text-xs tracking-widest">SCROLL</span>
            <div className={`w-px h-12 ${isDark ? 'bg-gradient-to-b from-blue-500/50 to-transparent' : 'bg-gradient-to-b from-blue-400/50 to-transparent'}`} />
          </div>
        </div>
      </div>
    </section>
  )
}
