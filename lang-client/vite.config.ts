import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  publicDir: './public',
  plugins: [solidPlugin()],
  build: {
    outDir: '../lang-cli/static',
    emptyOutDir: true,
    target: 'esnext',
    manifest: true,
    polyfillDynamicImport: false,
  },
});
