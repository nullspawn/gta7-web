# 🚗 AI-Driven GTA 7 — Liberty Streets

An open-world 3D driving game — **designed, coded, debugged, migrated, and shipped end-to-end by AI** through plain natural-language prompts.

Built with **React + [react-three-fiber](https://github.com/pmndrs/react-three-fiber)** on top of Three.js. Every model and 3D object is a real React component; the simulation runs in a single imperative game loop for 60 fps performance.

> 🤖 **AI-driven:** every line was produced by **Kitten Bot** (Bappi's AI developer persona, running on Claude) — from a vanilla-canvas prototype all the way to this Vite + React + R3F architecture.

## ▶️ Play

- **Online:** **https://abappi19.github.io/ai-driven-gta7/**
- Add `?autostart=1` to jump straight into a run.

## 🎮 Controls

| Input | Action |
| --- | --- |
| **Mouse** | Look around (click the world to capture the pointer) |
| **Click** | Shoot (on foot) |
| **Scroll** | Zoom camera in / out |
| **W / S** | Accelerate / brake & reverse |
| **A / D** | Steer / strafe left & right |
| **E** | Enter / exit nearest car or motorcycle |
| **Q** | Focus — slow-motion ability (drains a meter) |
| **Shift** | Boost |
| **Space** | Handbrake / drift |
| **C** | Cycle camera distance |
| **F** | Punch (on foot) / Honk (in vehicle) |
| **R** | Respawn |
| **Esc** | Release the mouse |

## ✨ Features

- Procedurally generated city — roads, lane lines, parks, window-facade buildings
- Drive **cars and motorcycles** (real glTF models) or roam on foot
- Pointer-lock mouse-look camera with scroll-to-zoom (handles macOS trackpad)
- AI traffic + wandering pedestrians
- **Wanted system** with police that chase, ram, and bust you
- **Shooting** with tracers and muzzle flash, and a **Focus** slow-motion ability
- Cash pickups and an escalating **delivery** mission chain
- Real-time shadows, lighting, fog, instanced particle FX, live minimap, HUD

## 🛠️ Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the build (note: base path differs in preview)
```

Requires Node 20+.

## 🧱 Architecture

```
src/
  game/            # framework-agnostic simulation
    constants.js   # tuning + world constants
    state.js       # mutable, NON-reactive world singleton (per-frame data)
    world.js       # procedural city generation + collision boxes
    systems.js     # physics, AI, shooting, wanted, missions (one fixed step)
    audio.js       # WebAudio synth
  store/
    useGame.js     # Zustand store — reactive UI/HUD state only
  components/      # every 3D object as a React component
    Scene/World, City, Trees, Vehicles, Player, Pedestrians, Pickups,
    MissionMarker, Effects (instanced), Lights, CameraRig, Controls, Systems
  ui/              # HUD, Minimap, Overlay (React DOM)
public/models/     # glTF vehicle models (served as static assets)
```

**Design principles**

- **No 60 fps React re-renders.** The hot path mutates a plain singleton (`game`) and copies transforms onto meshes in `useFrame`. React state (Zustand) holds only UI values, pushed on a throttle (~12x/sec). Entity-list components re-render only when membership changes (spawn/despawn), via version counters.
- **One authoritative loop** (`<Systems>`) advances a fixed simulation step, with a time accumulator powering the Focus slow-motion.
- **Models as components** via `useGLTF` + per-instance clones; particle FX via a single `InstancedMesh` pool.

## 🚢 Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with Vite and publishes `dist/` to GitHub Pages (`base: /ai-driven-gta7/`).

## 📦 Credits & Licenses

Game code by **Bappi**, written with **Kitten Bot**. Bundled third-party assets:

- **Three.js**, **react-three-fiber**, **drei**, **zustand** — MIT.
- **Motorcycle** model — *"Motorcycle"* by **Poly by Google**, **CC-BY 3.0**, via [poly.pizza](https://poly.pizza/).
- **Low-poly car** models — Imphenzia-style set ([nbogie/three-js-cars-2](https://github.com/nbogie/three-js-cars-2)).

If you reuse the CC-BY motorcycle model, keep its attribution.

---

*An AI-driven Bappi build · React + react-three-fiber · made with Kitten Bot.*
