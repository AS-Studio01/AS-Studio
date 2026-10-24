import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
        workMitti: resolve(__dirname, 'work/mitti-cafe.html'),
        workRao: resolve(__dirname, 'work/rao-law.html'),
        workVitalcare: resolve(__dirname, 'work/vitalcare.html'),
        workFold: resolve(__dirname, 'work/fold-atelier.html'),
        workApex: resolve(__dirname, 'work/apex-residences.html'),
        workAtelier: resolve(__dirname, 'work/atelier-north.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        notFound: resolve(__dirname, '404.html'),
        secret: resolve(__dirname, 'x7q2m9r4v8k1p6z3/index.html'),
        apex: resolve(__dirname, 'demos/apex-residences/index.html'),
        apexResidences: resolve(__dirname, 'demos/apex-residences/residences.html'),
        apexJournal: resolve(__dirname, 'demos/apex-residences/journal.html'),
        apexReserve: resolve(__dirname, 'demos/apex-residences/reserve.html'),
        apexAbout: resolve(__dirname, 'demos/apex-residences/about.html'),
        atelier: resolve(__dirname, 'demos/atelier-north/index.html'),
        atelierCollection: resolve(__dirname, 'demos/atelier-north/collection.html'),
        atelierCart: resolve(__dirname, 'demos/atelier-north/cart.html'),
        atelierCheckout: resolve(__dirname, 'demos/atelier-north/checkout.html'),
        atelierAbout: resolve(__dirname, 'demos/atelier-north/about.html'),
        vitalcare: resolve(__dirname, 'demos/vitalcare-multispeciality-clinic/index.html'),
        delta: resolve(__dirname, 'demos/delta-os/index.html'),
        mitti: resolve(__dirname, 'demos/mitti-cafe/index.html'),
        rao: resolve(__dirname, 'demos/rao-law/index.html'),
        fold: resolve(__dirname, 'demos/fold-atelier/index.html'),
        foldCollection: resolve(__dirname, 'demos/fold-atelier/collection.html'),
        foldAtelier: resolve(__dirname, 'demos/fold-atelier/atelier.html'),
        cancellation: resolve(__dirname, 'legal/cancellation-refund.html'),
        disclaimer: resolve(__dirname, 'legal/disclaimer.html'),
        privacy: resolve(__dirname, 'legal/privacy.html'),
        terms: resolve(__dirname, 'legal/terms.html'),
      },
    },
  },
});
