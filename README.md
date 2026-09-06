# BYD 3D Showroom - Step 2 Model Lab

This step is a temporary testing dashboard for the local BYD GLB collection. It uses React, Vite, Tailwind CSS, native Three.js, GLTFLoader, OrbitControls, GSAP, and ScrollTrigger. The final cinematic landing page is intentionally not included.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL, choose a vehicle from the selector, and test rotation, zoom, reset, auto-rotation, fullscreen, loading progress, and model switching.

## Models

All model files remain in one location:

```text
public/models/
```

The current dashboard is configured for every GLB file detected in that directory. Exact filenames are centralized in `src/data/vehicles.js`; do not rename or duplicate the files. New models should be added there with their exact `/models/<filename>.glb` URL.

Only the first selected vehicle loads initially. Other vehicles load on demand and are cached after their first request. Cached models are reused when selected again.

## Temporary Test Features

- Native Three.js scene with realistic temporary lights and a ground plane
- Automatic centering, bottom alignment, scaling, and camera framing
- OrbitControls with damping, bounded zoom, and limited vertical rotation
- Optional slow auto-rotation that pauses during interaction and resumes afterward
- GSAP model entrance, exit, switching, and reset animations
- Loading percentage, retryable errors, WebGL fallback, debug metrics, and responsive resize handling

This is Step 2 only. The next stage will build the cinematic showroom experience around the verified 3D vehicle system.
