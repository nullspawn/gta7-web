# GTA 7 — Liberty Streets

A top-down-meets-third-person open-world driving game that runs **100% in your browser** — no build step, no server, no install. Just open `index.html`.

Built with [Three.js](https://threejs.org/) and real-time WebGL: a procedural city, real 3D vehicle models, a pointer-lock mouse-look camera, a wanted/police system, shooting, a slow-motion ability, and more.

## ▶️ Play

- **Online:** see the GitHub Pages link in the repository's About section.
- **Locally:** download the repo and double-click `index.html` (works fully offline).

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

## 🛠️ Tech

Pure client-side: Three.js (vendored locally) + WebGL. GLB models are base64-inlined into `models.js` so the game loads over `file://` without a server.

## 📦 Credits & Licenses

This project's code is by **Bappi**. Bundled third-party assets:

- **Three.js** (r128) and **GLTFLoader** — MIT License, © three.js authors.
- **Motorcycle** model — *"Motorcycle"* by **Poly by Google**, licensed **CC-BY 3.0**, obtained via [poly.pizza](https://poly.pizza/).
- **Low-poly car** models — from the Imphenzia-style learning set ([nbogie/three-js-cars-2](https://github.com/nbogie/three-js-cars-2)).

If you reuse the CC-BY motorcycle model, keep its attribution.

---

*A Bappi build · made with Kitten Bot.*
