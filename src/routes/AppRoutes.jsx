// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import Workers from '../components/Workers';
import Production from '../components/Production';
import Summary from '../components/Summary';
import ProtectedRoute from '../components/ProtectedRoute'
import Teams from '../components/Teams';
import Solution from '../components/Solution';
import ViewTeam from '../components/ViewTeam';
import Requests from '../components/Requests';
import CreateRequest from '../components/CreateRequest';
import Tasks from '../components/Tasks';
import Attendance from '../components/Attendance';

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
        <Route path="inventory" element={<Inventory/>}/>
        <Route path="solution" element={<Solution />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="workers" element={<Workers/>} />
        <Route path="attendance" element={<Attendance/>}/>
        <Route path="teams" element={<Teams/>} />
        <Route path="viewteam/:id" element={<ViewTeam/>}/>
        <Route path="requests" element={<Requests/>}/>
        <Route path="newRequest" element={<CreateRequest/>}/>
        <Route path="tasks" element={<Tasks/>}/>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
