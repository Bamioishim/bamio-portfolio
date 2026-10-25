import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], base: '/bamio-portfolio/', build: { target: ['es2019', 'safari14'] } })
