import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </AuthContextProvider>
);
