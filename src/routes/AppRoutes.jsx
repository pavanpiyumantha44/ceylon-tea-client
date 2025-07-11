// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/protectedRoute';
import LoginPage from '../pages/login';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import Workers from '../components/Workers';
import Production from '../components/Production';
import Summary from '../components/Summary';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected dashboard routes with nested children */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Summary />} />
        <Route path="production" element={<Production />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="workers" element={<Workers/>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
