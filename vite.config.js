import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: mode === 'production' 
            ? 'https://citizen-engagement-backend.onrender.com'
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(
        mode === 'production'
          ? 'https://citizen-engagement-backend.onrender.com'
          : 'http://localhost:5000'
      ),
      'process.env.VITE_WS_URL': JSON.stringify(
        mode === 'production'
          ? 'wss://citizen-engagement-backend.onrender.com'
          : 'ws://localhost:5000'
      )
    }
  }
})