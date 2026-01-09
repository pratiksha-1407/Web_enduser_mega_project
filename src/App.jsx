import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import ProtectedRoute from './components/ProtectedRoute';

import ErrorBoundary from './components/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import RoleSelection from './components/RoleSelection';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import CreateOrder from './pages/employee/CreateOrder';
import Inventory from './pages/employee/Inventory';
import Orders from './pages/employee/Orders';
import AttendanceMark from './pages/employee/AttendanceMark';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';

import { ProductionDashboard, UserProfilePage } from './pages/RolePages';

// Owner Module Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerEmployees from './pages/owner/Employees';
import OwnerInventory from './pages/owner/Inventory';
import OwnerSales from './pages/owner/Sales';
import OwnerReports from './pages/owner/Reports';
import OwnerProfile from './pages/owner/Profile';
import OwnerLayout from './layouts/OwnerLayout';

// Marketing Module Pages
import MarketingLayout from './layouts/MarketingLayout';
import MarketingDashboardPage from './pages/marketing/Dashboard';
import TeamManagement from './pages/marketing/TeamManagement';
import OrderPage from './pages/marketing/OrderPage';
import FieldVisit from './pages/marketing/FieldVisit';
import MarketingProfile from './pages/marketing/Profile';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role" element={<RoleSelection />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Employee Routes - NEW MODULE */}
        <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="create-order" element={<CreateOrder />} />
            <Route path="inventory" element={<Inventory />} />
            {/* Orders routes */}
            <Route path="orders" element={<Navigate to="total" replace />} />
            <Route path="orders/:status" element={<Orders />} />

            {/* Attendance routes */}
            <Route path="attendance" element={<Navigate to="mark" replace />} />
            <Route path="attendance/mark" element={<AttendanceMark />} />
            <Route path="attendance/history" element={<AttendanceHistory />} />

            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Marketing Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Marketing Manager']} />}>
          <Route path="/marketing" element={<MarketingLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MarketingDashboardPage />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="visits" element={<FieldVisit />} />
            <Route path="profile" element={<MarketingProfile />} />
          </Route>
        </Route>

        {/* Production Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Production Manager']} />}>
          <Route element={<DashboardLayout role="Production Manager" />}>
            <Route path="/production/dashboard" element={<ProductionDashboard />} />
          </Route>
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
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
