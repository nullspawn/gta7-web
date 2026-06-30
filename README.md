# 🚗 AI-Driven GTA 7 — Liberty Streets

An entire open-world 3D driving game — **designed, coded, debugged, and shipped end-to-end by AI** through plain natural-language prompts. No game engine, no build step, no install. It runs **100% in your browser**: just open `index.html`.

Built with [Three.js](https://threejs.org/) + WebGL: a procedural city, real downloaded 3D vehicles, a pointer-lock mouse-look camera, a wanted/police system, shooting, and a slow-motion ability.

> 🤖 **AI-driven:** every line of this game was produced by **Kitten Bot** (Bappi's AI developer persona, running on Claude). It went from idea to a published GitHub project entirely via conversation.

## ▶️ Play

- **Online:** **https://abappi19.github.io/ai-driven-gta7/** *(enable GitHub Pages once: Settings → Pages → branch `main` / `/root`)*
- **Locally:** download the repo and double-click `index.html` — works fully offline.

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

- Procedurally generated city — roads, lane lines, parks, and buildings with window-facade textures
- Drive **cars and motorcycles** (real downloaded 3D models) or roam on foot
- Pointer-lock mouse-look camera with scroll-to-zoom (handles macOS trackpad)
- AI traffic + wandering pedestrians
- **Wanted system** with police that chase, ram, and bust you
- **Shooting** with bullet tracers and muzzle flash
- **Focus** slow-motion special ability
- Cash pickups and an escalating **delivery** mission chain
- Real-time shadows, lighting, fog, particle FX, live minimap, and HUD

## 🤖 How it was built

This project was created iteratively, one prompt at a time, by an AI agent:

1. A top-down 2D canvas prototype
2. Rebuilt into a hand-rolled 3D WebGL renderer
3. Migrated to **Three.js** with a proper mouse-look camera + WASD
4. Gameplay additions — shooting, a Focus slow-motion ability, motorcycles, a delivery chain
5. Tuning & fixes — corrected steering, calmer turn sensitivity, slower/gradual throttle, scroll-zoom
6. Swapped in **real downloaded 3D models** for the vehicles
7. Documented and published to GitHub

Every change was verified with automated syntax checks, headless-Chrome WebGL render captures, and gameplay simulation tests.

## 🛠️ Tech

Pure client-side: Three.js (vendored locally) + WebGL. GLB models are base64-inlined into `models.js` so the game loads over `file://` without a server.

```
index.html        # game + engine
three.min.js      # Three.js r128 (UMD build, vendored)
gltf-loader.js    # GLTFLoader (vendored)
models.js         # base64-inlined GLB vehicle models
models/*.glb      # original model files
```

## 📦 Credits & Licenses

Game code by **Bappi**, written with **Kitten Bot**. Bundled third-party assets:

- **Three.js** (r128) and **GLTFLoader** — MIT License, © three.js authors.
- **Motorcycle** model — *"Motorcycle"* by **Poly by Google**, licensed **CC-BY 3.0**, via [poly.pizza](https://poly.pizza/).
- **Low-poly car** models — from the Imphenzia-style learning set ([nbogie/three-js-cars-2](https://github.com/nbogie/three-js-cars-2)).

If you reuse the CC-BY motorcycle model, keep its attribution.

---

*An AI-driven Bappi build · made with Kitten Bot.*
