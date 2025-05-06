
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { TenantProvider } from './contexts/TenantContext.tsx'
import { AuthProvider } from './components/auth/AuthProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <Toaster position="top-right" />
          <App />
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
