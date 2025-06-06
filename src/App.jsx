import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard-user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>


  );

}

export default App;
