import { mount } from 'svelte'
import App from './components/App.svelte'

// Detecta Modo Escuro
if (window.matchMedia('(prefers-color-scheme: dark)')) {
  document.documentElement.setAttribute('data-bs-theme', 'dark')
}
else {
  document.documentElement.setAttribute('data-bs-theme', 'light')
}

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
