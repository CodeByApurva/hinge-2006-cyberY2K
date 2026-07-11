import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({

  base: '/hinge-2006-cyberY2K/',

  plugins: [react()],

  server: {

    port: 3000,

    open: true,

  },

});
