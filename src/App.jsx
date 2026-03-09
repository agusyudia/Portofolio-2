import { Suspense, lazy, useState, useCallback } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { usePortfolioData } from './hooks/usePortfolioData'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import LoadingScreen from './components/LoadingScreen'

const ThreeBackground = lazy(() => import('./components/ThreeBackground'))

function PortfolioApp() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { data } = usePortfolioData()
  const [ready, setReady] = useState(false)

  return (
    <>
      {/* Loading screen — unmounts when done, owns the only Canvas during loading */}
      {!ready && (
        <LoadingScreen
          dataReady={!!data}
          onDone={() => setReady(true)}
        />
      )}

      {/* Main content — only mounted AFTER loading done, so no double-Canvas */}
      {ready && data && (
        <div
          className={`min-h-screen ${isDark ? 'dark bg-[#020817]' : 'bg-slate-50'}`}
          style={{ animation: 'fadeInPage 0.7s ease forwards' }}
        >
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>

          <Navbar name={data.personal.name} />

          <main>
            <Hero data={data} />
            <About data={data} />
            <Experience data={data} />
            <Skills data={data} />
            <Portfolio data={data} />
            <Education data={data} />
            <Contact data={data} />
          </main>
        </div>
      )}

      <style>{`
        @keyframes fadeInPage {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  )
}
