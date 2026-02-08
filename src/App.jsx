import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import ProtectedRoute from './components/ProtectedRoute';

import ErrorBoundary from './components/ErrorBoundary';

// Pages
//import LandingPage from './pages/LandingPage';
import RoleSelection from './components/RoleSelection';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import CreateOrder from './pages/employee/CreateOrder';
import Inventory from './pages/employee/Inventory';
import Orders from './pages/employee/Orders';
import TrackOrder from './pages/employee/TrackOrder';
import AttendanceMark from './pages/employee/AttendanceMark';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';

import { UserProfilePage } from './pages/RolePages';

// Owner Module Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerEmployees from './pages/owner/Employees';
import AssignTarget from './pages/owner/AssignTarget';
import OwnerOrders from './pages/owner/Orders';
import OwnerPendingOrders from './pages/owner/PendingOrders';
import OwnerRevenue from './pages/owner/Revenue';
import OwnerInventory from './pages/owner/Inventory';
import OwnerSales from './pages/owner/Sales';
import OwnerReports from './pages/owner/Reports';
import OwnerProfile from './pages/owner/Profile';
import OwnerLayout from './layouts/OwnerLayout'; // Moved here for grouping

// Production Module Pages
import ProductionLayout from './layouts/ProductionLayout';

import MarketingLayout from './layouts/MarketingLayout';
import MarketingDashboard from './pages/marketing/Dashboard';
import MarketingAttendance from './pages/marketing/Attendance';
import TargetManagement from './pages/marketing/TargetManagement';
import DistrictTeam from './pages/marketing/DistrictTeam';
import OrderPage from './pages/marketing/OrderPage';
import FieldVisit from './pages/marketing/FieldVisit';
import MarketingProfile from './pages/marketing/Profile';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Employee', 'Marketing Executive']} />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="create-order" element={<CreateOrder />} />
            <Route path="orders" element={<Orders />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="attendance" element={<AttendanceMark />} />
            <Route path="attendance/history" element={<AttendanceHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Marketing Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Marketing Manager']} />}>
          <Route path="/marketing" element={<MarketingLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MarketingDashboard />} />
            <Route path="attendance" element={<MarketingAttendance />} />
            <Route path="targets" element={<TargetManagement />} />
            <Route path="team" element={<DistrictTeam />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="visits" element={<FieldVisit />} />
            <Route path="profile" element={<MarketingProfile />} />
          </Route>
        </Route>

        {/* Production Routes - Now handled entirely by ProductionLayout */}
        <Route element={<ProtectedRoute allowedRoles={['Production Manager']} />}>
          <Route path="/production/*" element={<ProductionLayout />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="assign-target" element={<AssignTarget />} />
            <Route path="orders" element={<OwnerOrders />} />
            <Route path="pending-orders" element={<OwnerPendingOrders />} />
            <Route path="revenue" element={<OwnerRevenue />} />
            <Route path="employees" element={<OwnerEmployees />} />
            <Route path="inventory" element={<OwnerInventory />} />
            <Route path="sales" element={<OwnerSales />} />
            <Route path="reports" element={<OwnerReports />} />
            <Route path="profile" element={<OwnerProfile />} />
          </Route>
        </Route>

        {/* Shared/Common Routes (Profile) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
