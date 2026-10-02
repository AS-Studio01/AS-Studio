import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
