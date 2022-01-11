import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    outDir: '../lang-cli/static',
    emptyOutDir: true,
    target: 'esnext',
    manifest: true,
    polyfillDynamicImport: false,
  },
});
