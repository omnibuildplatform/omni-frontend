import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve('./src/assets/svg-icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.193:8080',
        changeOrigin: true,
      },
    },
  },
});
