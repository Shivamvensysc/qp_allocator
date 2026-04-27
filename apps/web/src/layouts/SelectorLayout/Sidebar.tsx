import React from "react";
import { LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { clearToken } from "../../utils/token";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      clearToken();

      navigate("/auth/loginSelector");
    } catch (error) {
      console.error("Logout failed:", error);

      clearToken();

      navigate("/auth/loginSelector");
    }
  };

  return (
    <div className="w-48 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-2 border-b border-slate-700">
        <h1 className="text-lg font-black tracking-tight text-white uppercase">
          ExamCore
        </h1>

        <p className="text-[10px] font-bold text-teal-400 mt-1 uppercase tracking-widest">
          Enterprise v4.0
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-2">
          {/* Allocations Link */}
          <Link
            to="/selectorControl"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-600/90 text-white shadow-lg shadow-teal-900/40 cursor-pointer transition group"
          >
            <Shield
              size={18}
              className="group-hover:scale-110 transition-transform"
            />

            <span className="text-sm font-bold">Allocations</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-700/50 p-4 space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition group border border-transparent hover:border-red-500/20"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />

          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
