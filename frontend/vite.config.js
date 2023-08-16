import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Set the desired localhost address (e.g., 127.0.0.1, 0.0.0.0, etc.)
    port: 3000, // Set the desired port number
  },
})
