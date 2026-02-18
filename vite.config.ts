import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/FinalTestamentProofILived/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'effects': ['./src/effects/MatrixRain.ts', './src/effects/ParticleNetwork.ts', './src/effects/GradientFlow.ts']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}))

