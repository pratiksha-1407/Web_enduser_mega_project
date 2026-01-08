import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import RoleSelection from './components/RoleSelection';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardHome from './pages/employee/DashboardHome';
import CreateOrderPage from './pages/employee/CreateOrderPage';
import OrderHistoryPage from './pages/employee/OrderHistoryPage';
import AttendancePage from './pages/employee/AttendancePage';
import { MarketingDashboard, ProductionDashboard, OwnerDashboard, UserProfilePage } from './pages/RolePages';
//import RoleSelection from './components/RoleSelection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Employee Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
        <Route element={<DashboardLayout role="Employee" />}>
          <Route path="/employee/dashboard" element={<DashboardHome />} />
          <Route path="/employee/orders/new" element={<CreateOrderPage />} />
          <Route path="/employee/orders" element={<OrderHistoryPage />} />
          <Route path="/employee/attendance" element={<AttendancePage />} />
        </Route>
      </Route>

      {/* Marketing Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Marketing Manager']} />}>
        <Route element={<DashboardLayout role="Marketing Manager" />}>
          <Route path="/marketing/dashboard" element={<MarketingDashboard />} />
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
        <Route element={<DashboardLayout role="Owner" />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
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
  );
}

export default App;