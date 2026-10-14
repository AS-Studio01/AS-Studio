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
        secret: resolve(__dirname, 'x7q2m9r4v8k1p6z3/index.html'),
        apex: resolve(__dirname, 'demos/apex-residences/index.html'),
        apexAbout: resolve(__dirname, 'demos/apex-residences/about.html'),
        apexJournal: resolve(__dirname, 'demos/apex-residences/journal.html'),
        apexReserve: resolve(__dirname, 'demos/apex-residences/reserve.html'),
        apexResidence: resolve(__dirname, 'demos/apex-residences/residence.html'),
        apexResidences: resolve(__dirname, 'demos/apex-residences/residences.html'),
        atelier: resolve(__dirname, 'demos/atelier-north/index.html'),
        atelierAbout: resolve(__dirname, 'demos/atelier-north/about.html'),
        atelierCart: resolve(__dirname, 'demos/atelier-north/cart.html'),
        atelierCheckout: resolve(__dirname, 'demos/atelier-north/checkout.html'),
        atelierCollection: resolve(__dirname, 'demos/atelier-north/collection.html'),
        atelierProduct: resolve(__dirname, 'demos/atelier-north/product.html'),
        fold: resolve(__dirname, 'demos/fold-atelier/index.html'),
        foldAtelier: resolve(__dirname, 'demos/fold-atelier/atelier.html'),
        foldCollection: resolve(__dirname, 'demos/fold-atelier/collection.html'),
        nova: resolve(__dirname, 'demos/nova-dental/index.html'),
        novaBook: resolve(__dirname, 'demos/nova-dental/book.html'),
        novaTreatments: resolve(__dirname, 'demos/nova-dental/treatments.html'),
        mitti: resolve(__dirname, 'demos/mitti-cafe/index.html'),
        rao: resolve(__dirname, 'demos/rao-law/index.html'),
        cancellation: resolve(__dirname, 'legal/cancellation-refund.html'),
        disclaimer: resolve(__dirname, 'legal/disclaimer.html'),
        privacy: resolve(__dirname, 'legal/privacy.html'),
        terms: resolve(__dirname, 'legal/terms.html'),
      },
    },
  },
});
