import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { glslify } from 'vite-plugin-glslify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glslify()],
  server: { port: 3000 },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/styles/utils/variables.scss";
        @import "@/styles/utils/mixins.scss";
        @import "@/styles/utils/functions.scss";
        @import "@/styles/shared/links.scss";
        @import "@/styles/shared/pages.scss";
        `,
      },
    },
  },
});
