import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { background: '#082440', color: '#e6f4ff', border: '1px solid rgba(148,210,255,.15)', borderRadius: '14px' } }} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
