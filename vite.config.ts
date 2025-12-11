import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This assumes you will name your repo "ordering-system"
  // If you name it something else, change this line to '/your-repo-name/'
  base: '/ordering-system/', 
})