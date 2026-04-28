import React from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout/Index";

const AdminRouteLayout: React.FC = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRouteLayout;