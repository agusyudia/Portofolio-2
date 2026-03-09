import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Rotating torus knot
function RotatingKnot() {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.25
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.35
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[2.8, 0.55, 140, 18]} />
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.18}
        emissive="#60a5fa"
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

// Floating octahedrons
function FloatGeo({ position, speed }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x += speed.x
    ref.current.rotation.y += speed.y
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.4
  })
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color="#60a5fa" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

// Particle field
function Particles() {
  const ref = useRef()
  const count = 1800
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 50
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#60a5fa" transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

// 3D Scene for loading
function LoadingScene() {
  const geos = useMemo(() => [
    { position: [-7, 3, -4],  speed: { x: 0.005, y: 0.007 } },
    { position: [7, -2, -3],  speed: { x: 0.004, y: 0.005 } },
    { position: [-4, -5, -5], speed: { x: 0.006, y: 0.003 } },
    { position: [5, 5, -6],   speed: { x: 0.003, y: 0.008 } },
    { position: [0, -6, -2],  speed: { x: 0.007, y: 0.004 } },
    { position: [-9, 0, -6],  speed: { x: 0.004, y: 0.006 } },
  ], [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#8b5cf6" />
      <Particles />
      <RotatingKnot />
      {geos.map((g, i) => (
        <FloatGeo key={i} position={g.position} speed={g.speed} />
      ))}
    </>
  )
}

// Progress counter — caps at 90% until dataReady, then finishes to 100%
function useProgress(dataReady, duration = 2200) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = performance.now()
    const tick = (now) => {
      const elapsed = now - startRef.current
      const raw = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - raw, 2)
      // Cap at 90 until data is ready, then allow 100
      const cap = dataReady ? 100 : 90
      setProgress(Math.min(Math.round(eased * 100), cap))
      if (raw < 1 || !dataReady) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, []) // eslint-disable-line

  // Once data arrives, push to 100 quickly
  useEffect(() => {
    if (dataReady) {
      cancelAnimationFrame(rafRef.current)
      setProgress(100)
    }
  }, [dataReady])

  return progress
}

export default function LoadingScreen({ onDone, dataReady }) {
  const progress = useProgress(dataReady, 2200)
  const [hiding, setHiding] = useState(false)
  const [letters, setLetters] = useState([])
  const name = 'I Putu Agus Yudi Artawan'

  // Letter-by-letter reveal
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < name.length) {
        setLetters(prev => [...prev, name[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [])

  // Trigger fade-out only when progress = 100 AND data is ready
  useEffect(() => {
    if (progress >= 100 && dataReady) {
      const t = setTimeout(() => {
        setHiding(true)
        setTimeout(onDone, 600)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [progress, dataReady, onDone])

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#020817] flex flex-col items-center justify-center
        transition-opacity duration-600
        ${hiding ? 'opacity-0' : 'opacity-100'}
      `}
      style={{ transition: 'opacity 0.6s ease' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <LoadingScene />
        </Canvas>
      </div>

      {/* Center UI */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">

        {/* Logo with glow rings */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border border-blue-400/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
          {/* Logo box */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <span className="text-2xl font-extrabold text-white tracking-tight">AY</span>
          </div>
        </div>

        {/* Name letter-by-letter */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide min-h-[2rem]">
            {letters.map((ch, i) => (
              <span
                key={i}
                className="inline-block animate-[fadeInUp_0.3s_ease_forwards]"
                style={{ opacity: 0, animation: 'fadeInChar 0.25s ease forwards' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>
          <p className="text-blue-400 text-sm font-medium mt-1 tracking-widest uppercase">
            Frontend Web Developer
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 tracking-widest">Loading</span>
            <span className="text-xs font-bold text-blue-400">{progress}%</span>
          </div>
          <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dot loader */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInChar {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
