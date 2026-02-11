import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  root: '.',
  build: {
    outDir: '../dist/webview',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'iife',
        inlineDynamicImports: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    conditions: ['browser']  // ← AGREGAR ESTO
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')  // ← AGREGAR ESTO
  }
});