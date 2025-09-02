// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory/Inventory';
import Workers from '../components/Workers/Workers';
import Production from '../components/Production/Production';
import Summary from '../components/Summary';
import ProtectedRoute from '../components/ProtectedRoute'
import Teams from '../components/Workers/Teams';
import Solution from '../components/Solution/Solution';
import ViewTeam from '../components/Workers/ViewTeam';
import Tasks from '../components/Task/Tasks';
import Attendance from '../components/Attendance/Attendance';
import Place from '../components/Place/Place';
import ViewPlace from '../components/Place/ViewPlace';
import CreateTask from '../components/Task/CreateTask';
import EditProduct from '../components/Inventory/EditProduct';
import StockTransactions from '../components/Inventory/StockTransactions';
import TeaPlucking from '../components/Production/TeaPlukcing';
import Payroll from '../components/Payroll/Salary';
import VehicleManagement from '../components/Vehicles/Vehicles';
import ReportsManagement from '../components/Reports/ReportsManagement';
import EditTask from '../components/Task/EditTask';

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
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="teaPlucking" element={<TeaPlucking />} />
        <Route path="inventory" element={<Inventory/>}/>
        <Route path="solution" element={<Solution />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="stockTransactions" element={<StockTransactions />} />
        <Route path="editProduct/:id" element={<EditProduct />} />
        <Route path="workers" element={<Workers/>} />
        <Route path="attendance" element={<Attendance/>}/>
        <Route path="place" element={<Place/>}/>
        <Route path="viewplace/:id" element={<ViewPlace/>}/>
        <Route path="payroll" element={<Payroll/>}/>
        <Route path="teams" element={<Teams/>} />
        <Route path="viewteam/:id" element={<ViewTeam/>}/>
        <Route path="newTask" element={<CreateTask/>}/>
        <Route path="tasks" element={<Tasks/>}/>
        <Route path="editTask/:id" element={<EditTask/>}/>
        <Route path="vehicles" element={<VehicleManagement/>}/>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
