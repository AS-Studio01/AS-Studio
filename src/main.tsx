import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthContextProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </AuthContextProvider>
  </ThemeProvider>
);
