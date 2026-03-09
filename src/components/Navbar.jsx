import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ name }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = ['home', 'about', 'experience', 'skills', 'portfolio', 'education', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const glassClass = isDark
    ? 'bg-slate-900/80 border-blue-500/20'
    : 'bg-white/85 border-slate-200'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `${glassClass} backdrop-blur-xl border-b shadow-lg`
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className={`font-bold text-xl tracking-wide ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}
        >
          <span className="gradient-text">Yudi Dev</span>
          <span className={`ml-1 text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Portofolio
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = active === link.href.replace('#', '')
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 relative
                    ${isActive
                      ? 'text-blue-500'
                      : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-blue-600'
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Theme toggle + mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none
              ${isDark ? 'bg-blue-600' : 'bg-slate-300'}
            `}
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs
                ${isDark
                  ? 'left-7 bg-slate-900'
                  : 'left-1 bg-white shadow'
                }
              `}
            >
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className={`flex flex-col gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span className={`block h-0.5 w-5 transition-all duration-300 rounded ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 rounded ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 transition-all duration-300 rounded ${isDark ? 'bg-white' : 'bg-slate-800'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-t ${isDark ? 'border-blue-500/20' : 'border-slate-200'} px-6 py-4`}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-medium border-b ${isDark ? 'border-slate-800 text-slate-300 hover:text-blue-400' : 'border-slate-100 text-slate-600 hover:text-blue-600'}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
