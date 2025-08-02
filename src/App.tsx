import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenerateLeads from './pages/GenerateLeads';
import GerarLeads from './pages/GerarLeads';
import Profile from './pages/Profile';
import Comprar from './pages/Comprar';
import Creditos from './pages/Creditos';
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/generate" element={
              <ProtectedRoute>
                <Layout>
                  <GenerateLeads />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/gerar-leads" element={
              <ProtectedRoute>
                <Layout>
                  <GerarLeads />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/comprar" element={
              <ProtectedRoute>
                <Layout>
                  <Comprar />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/creditos" element={
              <ProtectedRoute>
                <Layout>
                  <Creditos />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 