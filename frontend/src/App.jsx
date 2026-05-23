import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import AdminsManagement from './pages/AdminsManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize:   '13px',
              fontWeight: '500',
              borderRadius: '14px',
              background: '#0f172a',
              color:      '#f1f5f9',
              border:     '1px solid rgba(255,255,255,0.08)',
              boxShadow:  '0 8px 32px rgba(0,0,0,0.35)',
              padding:    '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0f172a' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#0f172a' },
            },
          }}
        />
        <Routes>
          {/* Public / Auth */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index             element={<Dashboard />}           />
            <Route path="cars"       element={<FleetManagement />}      />
            <Route path="bookings"   element={<Bookings />}             />
            <Route path="customers"  element={<Customers />}            />
            <Route path="rentals"    element={<Rentals />}              />
            <Route path="admins"     element={<AdminsManagement />}     />
          </Route>

          {/* Fallback */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
