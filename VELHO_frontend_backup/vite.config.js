import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    proxy: {
      // Redireciona requisições de /api para o worker do Cloudflare (rodando em outra porta)
      '/api': 'http://127.0.0.1:8787'
    }
  }
});