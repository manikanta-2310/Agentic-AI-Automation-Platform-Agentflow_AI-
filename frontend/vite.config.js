import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist')
  },
  define: {
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify('http://localhost:5000/api'),
    'process.env.NEXT_PUBLIC_SOCKET_URL': JSON.stringify('http://localhost:5000')
  }
});
