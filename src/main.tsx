
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { TenantProvider } from './contexts/TenantContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TenantProvider>
        <Toaster position="top-right" />
        <App />
      </TenantProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
