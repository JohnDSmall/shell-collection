import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /<repo-name>/, so the asset base must match.
export default defineConfig({
  plugins: [react()],
  base: '/shell-collection/',
});
