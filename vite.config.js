import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        packages: resolve(__dirname, 'packages.html'),
        work: resolve(__dirname, 'work.html'),
        asStudio: resolve(__dirname, 'work/as-studio.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        notFound: resolve(__dirname, '404.html'),
        services: resolve(__dirname, 'services.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        portal: resolve(__dirname, 'portal/index.html'),
        secret: resolve(__dirname, 'x7q2m9r4v8k1p6z3/Index.html'),
        apex: resolve(__dirname, 'demos/apex-residences/index.html'),
        apexFile: resolve(__dirname, 'demos/apex-residences.html'),
        apexFinal: resolve(__dirname, 'demos/apex-residences-final.html'),
        atelier: resolve(__dirname, 'demos/atelier-north/index.html'),
        atelierFile: resolve(__dirname, 'demos/atelier-north.html'),
        nova: resolve(__dirname, 'demos/nova-dental-care/index.html'),
        novaFile: resolve(__dirname, 'demos/nova-dental-care.html'),
        aura: resolve(__dirname, 'demos/aura-decor/index.html'),
        auraFile: resolve(__dirname, 'demos/aura-decor.html'),
        mitti: resolve(__dirname, 'demos/mitti-cafe/index.html'),
        mittiFile: resolve(__dirname, 'demos/mitti-cafe.html'),
        lumina: resolve(__dirname, 'demos/lumina-skin/index.html'),
        luminaFile: resolve(__dirname, 'demos/lumina-skin.html'),
        cancellation: resolve(__dirname, 'legal/cancellation-refund.html'),
        disclaimer: resolve(__dirname, 'legal/disclaimer.html'),
        privacy: resolve(__dirname, 'legal/privacy.html'),
        terms: resolve(__dirname, 'legal/terms.html'),
      },
    },
  },
});
