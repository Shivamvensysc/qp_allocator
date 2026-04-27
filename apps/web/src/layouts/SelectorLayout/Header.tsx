import React from "react";
import { useAuth } from "../../hooks/useAuth";

interface User {
  username: string;
  type: "admin" | "selector";
}

interface AuthContextType {
  user: User | null;
}

const Header: React.FC = () => {
  const { user } = useAuth() as AuthContextType;

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Title and navigation */}
        <div className="flex items-center gap-10">
          <h2 className="text-xl font-black text-[#0b1628] uppercase tracking-tighter">
            Paper Allocator Pro
          </h2>
        </div>

        {/* Right side - Search, notifications, profile */}
        <div className="flex items-center gap-6">
          {/* User Profile */}
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">
                {user.username}
              </p>
              <div className="flex items-center justify-end gap-1.5 leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
                  {user.type === "admin" ? "Root Admin" : "Complete clearance"}
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-[#0b1628] font-bold transition-all group-hover:border-emerald-200 group-hover:bg-emerald-50 overflow-hidden">
                <span className="relative z-10">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
