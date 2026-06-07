import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  //base: '/flowtrack-app/',
  base: './',
  server: {
    host: true, // expone en tu red local
    port: 5173,
  },
})
