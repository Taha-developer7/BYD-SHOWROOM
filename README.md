# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# BYD Showroom Foundation

This is the technical foundation for a premium BYD 3D showroom: React, Vite, Tailwind CSS, native Three.js, GLTFLoader, OrbitControls, GSAP, and ScrollTrigger. The full cinematic showroom will be built in a later stage.

## Add GLB Models

1. Place your `.glb` files inside:

	`public/models/`

2. For example:

	`public/models/byd-seal.glb`

3. Open `src/data/vehicles.js`.

4. Add or update a model entry:

	```js
	{
	  id: 'seal',
	  name: 'BYD SEAL',
	  model: '/models/byd-seal.glb',
	}
	```

5. Start the project:

	```bash
	npm install
	npm run dev
	```

The example viewer currently points to `/models/byd-seal.glb`. Until you add that file, it will show the model load error without crashing the app.
"# BYD-SHOWROOM" 
