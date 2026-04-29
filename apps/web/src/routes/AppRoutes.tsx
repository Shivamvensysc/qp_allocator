import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import SelectorLogin from "../pages/auth/SelectorLogin";
import SelectorDashboard from "../pages/dashboard/selector/SelectorDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import MainLayout from "../layouts/SelectorLayout/Index";
import RandomizationProgress from "../pages/dashboard/selector/RandomizationProgress";
import AdminLayout from "./AdminRouteLayout";
import AdminDashboardPage from "../pages/dashboard/admin/AdminDashboardPage";
import AdminSelectorPage from "../pages/dashboard/admin/AdminSelectorPage";
import ExamConfiguration from "../pages/dashboard/admin/ExamConfigration";
import ReviewPublish from "../pages/dashboard/admin/ReviewPublish";
import NotFound from "../pages/NotFound";
export const AppRoutes = () => {
  return (
    <Routes>
      {/* root path */}
      <Route path="/" element={<Navigate to="/auth/loginAdmin" replace />} />

      {/* for auth */}
      <Route path="/auth/loginAdmin" element={<AdminLogin />} />
      <Route path="/auth/loginSelector" element={<SelectorLogin />} />

      {/*  Layout Wrapper for selector  */}
      <Route element={<MainLayout />}>
        <Route
          path="/selectorControl/*"
          element={
            <ProtectedRoute role="selector">
              <SelectorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/randomization-progress"
          element={
            <ProtectedRoute role="selector">
              <RandomizationProgress />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* layout wrapper for admin  */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/adminselectorcontroller"
          element={
            <ProtectedRoute role="admin">
              <AdminSelectorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/examconfigration"
          element={
            <ProtectedRoute role="admin">
              <ExamConfiguration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/review_publish"
          element={
            <ProtectedRoute role="admin">
              <ReviewPublish />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
