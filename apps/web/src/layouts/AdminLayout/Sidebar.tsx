import React from "react";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/adminselectorcontroller",
    label: "Selector Controls",
    icon: SlidersHorizontal,
  },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const pathname = location.pathname;

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-[#0b1727] text-slate-100 shadow-xl h-screen">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}

        <div className="px-6 py-4 flex flex-col gap-1 flex-shrink-0">
          <h1 className="text-xl font-bold tracking-wide text-white">UPESSC</h1>
          <p className="text-[13px]">Government of Uttar Pradesh</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-hidden space-y-1 flex flex-col px-3 py-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center gap-4 py-3 px-4 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#1b2b3b]/60 text-emerald-400 border-l-[3px] border-emerald-400"
                    : "text-slate-300 hover:bg-[#1b2b3b]/40 hover:text-white border-l-[3px] border-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    active
                      ? "text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* New Exam Button */}
        <div className="px-5 py-4 flex-shrink-0">
          <button
            onClick={() => navigate("/admin/examconfigration")}
            className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#162c46] hover:bg-[#1b3452] border border-[#223f61] px-4 py-2.5 text-xs font-semibold text-emerald-400 transition"
          >
            <Plus className="h-4 w-4" />
            New Exam
          </button>
        </div>

        {/* Bottom Section */}

        <div className="px-5 py-6 flex-shrink-0 space-y-2 mt-auto">
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition"
          >
            <Settings className="h-5 w-5 text-slate-400" />
            <span>Settings</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
