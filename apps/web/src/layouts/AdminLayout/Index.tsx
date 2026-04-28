import React from "react";
import AdminSidebar from "./Sidebar";
import AdminHeader from "./Header";

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
