import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/move-dm-landing/',
  plugins: [react()],
})
