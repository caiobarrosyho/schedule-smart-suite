import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { TenantProvider } from './contexts/TenantContext.tsx'
import { AuthProvider } from './components/auth/AuthProvider.tsx'
import { SidebarProvider } from './components/ui/sidebar'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <SidebarProvider>
        <TenantProvider>
          <AuthProvider>
            <Toaster position="top-right" />
            <App />
          </AuthProvider>
        </TenantProvider>
      </SidebarProvider>
    </Router>
  </React.StrictMode>,
)
