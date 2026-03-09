# Portfolio 2 — Project Memory

## Stack
- Vite 5 + React 18 (Node 18 compatible — use `vite@5` not latest)
- Three.js + @react-three/fiber + @react-three/drei (lazy loaded)
- Tailwind CSS v3 + dark mode via `class`
- No backend — data from `public/data.json`

## Key files
- `src/App.jsx` — root, ThemeProvider wraps everything
- `src/context/ThemeContext.jsx` — dark/light toggle, persisted to localStorage
- `src/hooks/usePortfolioData.js` — fetches `/data.json`
- `src/components/ThreeBackground.jsx` — Three.js 3D scene (lazy loaded)
- `src/components/Navbar.jsx` — fixed nav with active section highlight + theme toggle
- `src/components/Hero.jsx` — typewriter, stats, CTA
- `src/components/About.jsx` — summary + contact info cards
- `src/components/Experience.jsx` — timeline cards (most recent first)
- `src/components/Skills.jsx` — skill bars by category
- `src/components/Education.jsx` — education + certifications
- `src/components/Contact.jsx` — contact CTA
- `public/data.json` — all CV content (edit here to update)

## Dev server
- `npm run dev` → http://localhost:5173
- Launch config: `.claude/launch.json`

## CSS notes
- `@import` must come BEFORE `@tailwind` directives in `index.css`
- Glassmorphism: `.glass-dark` / `.glass-light`
- Gradient text: `.gradient-text`
- Section underline: `.section-title-line::after`

## Owner
I Putu Agus Yudi Artawan — Frontend Web Developer, Bali
