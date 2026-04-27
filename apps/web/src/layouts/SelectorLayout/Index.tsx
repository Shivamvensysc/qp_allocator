import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-white">
    
      <Sidebar />

      <div className="flex flex-col flex-1">
        <div className="flex flex-1 overflow-y-auto min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
