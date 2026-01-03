import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import SOSPage from './pages/SOSPage';
import Shelters from './pages/Shelters';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AIInsights from './pages/AIInsights';
import AdminReports from './pages/AdminReports';
import AdminUsers from './pages/AdminUsers';

function App() {
  const { token, user } = useSelector((state: RootState) => state.auth);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    return token && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <SOSPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shelters"
          element={
            <ProtectedRoute>
              <Shelters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <AdminRoute>
              <AIInsights />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;

