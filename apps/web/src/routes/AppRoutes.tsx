import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { Loader2 } from "lucide-react";

const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const SelectorLogin = lazy(() => import("../pages/auth/SelectorLogin"));
const SelectorDashboard = lazy(
  () => import("../pages/dashboard/selector/SelectorDashboard"),
);
const RandomizationProgress = lazy(
  () => import("../pages/dashboard/selector/RandomizationProgress"),
);
const AdminDashboardPage = lazy(
  () => import("../pages/dashboard/admin/AdminDashboardPage"),
);
const AdminSelectorPage = lazy(
  () => import("../pages/dashboard/admin/AdminSelectorPage"),
);
const ExamConfiguration = lazy(
  () => import("../pages/dashboard/admin/ExamConfigration"),
);
const ReviewPublish = lazy(
  () => import("../pages/dashboard/admin/ReviewPublish"),
);
const MainLayout = lazy(() => import("../layouts/SelectorLayout/Index"));
const AdminLayout = lazy(() => import("./AdminRouteLayout"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-[#1d3557]" />
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* root path */}
        <Route path="/" element={<Navigate to="/auth/loginAdmin" replace />} />

        {/* auth routes */}
        <Route path="/auth/loginAdmin" element={<AdminLogin />} />
        <Route path="/auth/loginSelector" element={<SelectorLogin />} />

        {/* selector layout */}
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

        {/* admin layout */}
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

        {/* 404 not found  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
