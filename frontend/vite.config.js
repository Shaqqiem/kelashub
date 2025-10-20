import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages under repo path, set base to '/kelashub-v3/'
export default defineConfig({
  plugins: [react()],
  base: '/kelashub-v3/'
})
