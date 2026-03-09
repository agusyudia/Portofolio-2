import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

// Floating geometric shapes
function FloatingGeometry({ position, rotationSpeed, color, shape = 'octahedron' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += rotationSpeed.x
    meshRef.current.rotation.y += rotationSpeed.y
    meshRef.current.rotation.z += rotationSpeed.z
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron': return new THREE.OctahedronGeometry(0.4, 0)
      case 'tetrahedron': return new THREE.TetrahedronGeometry(0.4, 0)
      case 'icosahedron': return new THREE.IcosahedronGeometry(0.4, 0)
      case 'torus': return new THREE.TorusGeometry(0.3, 0.1, 8, 20)
      default: return new THREE.OctahedronGeometry(0.4, 0)
    }
  }, [shape])

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  )
}

// Star / particle field
function StarField({ isDark }) {
  const pointsRef = useRef()

  const particleCount = 2500
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.06 : 0.04}
        color={isDark ? '#60a5fa' : '#3b82f6'}
        transparent
        opacity={isDark ? 0.7 : 0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Animated ring / torus knot accent
function GlowRing({ isDark }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <torusKnotGeometry args={[3, 0.5, 120, 16]} />
      <meshStandardMaterial
        color={isDark ? '#1e40af' : '#93c5fd'}
        wireframe
        transparent
        opacity={0.12}
        emissive={isDark ? '#3b82f6' : '#60a5fa'}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Connection lines between particles
function ConnectionWeb({ isDark }) {
  const meshRef = useRef()
  const count = 80

  const { positions, indices } = useMemo(() => {
    const pos = []
    const idx = []
    const pts = []

    for (let i = 0; i < count; i++) {
      pts.push([
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5,
      ])
    }

    pts.forEach(p => pos.push(...p))

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i][0] - pts[j][0]
        const dy = pts[i][1] - pts[j][1]
        const dz = pts[i][2] - pts[j][2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 6) {
          idx.push(i, j)
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      indices: new Uint16Array(idx),
    }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={indices}
          count={indices.length}
          itemSize={1}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={isDark ? '#3b82f6' : '#93c5fd'}
        transparent
        opacity={isDark ? 0.12 : 0.08}
      />
    </lineSegments>
  )
}

// Scene with all 3D elements
function Scene({ isDark }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 10)
  }, [camera])

  const shapes = useMemo(() => [
    { position: [-8, 3, -4], rotationSpeed: { x: 0.003, y: 0.005, z: 0.002 }, shape: 'octahedron' },
    { position: [8, -2, -3], rotationSpeed: { x: 0.004, y: 0.003, z: 0.005 }, shape: 'icosahedron' },
    { position: [-5, -5, -5], rotationSpeed: { x: 0.002, y: 0.006, z: 0.003 }, shape: 'tetrahedron' },
    { position: [6, 5, -6], rotationSpeed: { x: 0.005, y: 0.002, z: 0.004 }, shape: 'torus' },
    { position: [0, -7, -3], rotationSpeed: { x: 0.003, y: 0.004, z: 0.002 }, shape: 'octahedron' },
    { position: [-10, 0, -7], rotationSpeed: { x: 0.006, y: 0.003, z: 0.005 }, shape: 'icosahedron' },
  ], [])

  const shapeColor = isDark ? '#3b82f6' : '#60a5fa'

  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.5 : 0.8} color={isDark ? '#3b82f6' : '#60a5fa'} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />

      <StarField isDark={isDark} />
      <GlowRing isDark={isDark} />
      <ConnectionWeb isDark={isDark} />

      {shapes.map((s, i) => (
        <FloatingGeometry
          key={i}
          position={s.position}
          rotationSpeed={s.rotationSpeed}
          color={shapeColor}
          shape={s.shape}
        />
      ))}
    </>
  )
}

export default function ThreeBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div id="three-canvas">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  )
}
