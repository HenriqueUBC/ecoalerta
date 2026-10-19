import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: "https://henriqueubc.github.io/ecoalerta",
  plugins: [svelte()],
})
