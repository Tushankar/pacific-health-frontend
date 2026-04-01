import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/auth/Login/Login";
import { Register } from "./pages/auth/Register/Register";
import { Layout } from "./components/common/Layout";
import Dashboard from "./pages/onboarding-user/Dashboard";
import Profile from "./pages/shared/Profile";
import MyApplication from "./pages/onboarding-user/MyApplication";
import MyApplicationsList from "./pages/onboarding-user/MyApplicationList";
import Communication from "./pages/shared/Communication";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail";
import AdminFormView from "./pages/admin/AdminFormView";
import AdminProgramOverview from "./pages/admin/AdminProgramOverview";
import AdminAfterHire from "./pages/admin/AdminAfterHire";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Router>
      <div className="font-['Poppins',sans-serif]">
        <Routes>
          {/* Auth routes without layout */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route
            path="/admin/application/:id"
            element={
              <Layout>
                <AdminApplicationDetail />
              </Layout>
            }
          />
          <Route
            path="/admin/application/:id/form/:formId"
            element={
              <Layout>
                <AdminFormView />
              </Layout>
            }
          />
          <Route
            path="/admin/programs"
            element={
              <Layout>
                <AdminProgramOverview />
              </Layout>
            }
          />
          <Route
            path="/admin/after-hire"
            element={
              <Layout>
                <AdminAfterHire />
              </Layout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Layout>
                <UserManagement />
              </Layout>
            }
          />

          <Route
            path="/my-application"
            element={
              <Layout>
                <MyApplication />
              </Layout>
            }
          />
          <Route
            path="/my-application-view"
            element={
              <Layout>
                <MyApplication />
              </Layout>
            }
          />
          <Route
            path="/my-applications"
            element={
              <Layout>
                <MyApplicationsList />
              </Layout>
            }
          />
          <Route
            path="/communication"
            element={
              <Layout>
                <Communication />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

          {/* Automatically redirect root to login page */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Fallback for HRMS compatibility */}
          <Route path="/auth/log-in" element={<Login />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
