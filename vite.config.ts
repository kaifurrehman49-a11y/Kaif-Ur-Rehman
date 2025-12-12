import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: true, // This allows the server to be accessed by your phone
      port: 5173
    },
    define: {
      // Connects your .env file to the code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})