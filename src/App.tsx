
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Fallback para rotas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
