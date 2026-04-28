import React, { useState, useEffect } from "react";
import { LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { clearToken } from "../../utils/token";
import { useToast } from "../../hooks/useToast";

// Custom hook for logout confirmation
const useLogoutWithConfirmation = (
  navigate: ReturnType<typeof useNavigate>,
) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const confirmLogout = () => {
    setIsDialogOpen(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
      clearToken();
      setIsDialogOpen(false);
      toast.success("Logged out successfully!");
      navigate("/auth/loginSelector", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      clearToken();
      setIsDialogOpen(false);
      navigate("/auth/loginSelector", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setIsDialogOpen(false);
  };

  return {
    confirmLogout,
    handleLogout,
    cancelLogout,
    isDialogOpen,
    isLoggingOut,
  };
};

// Confirmation Modal Component
const LogoutConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoggingOut?: boolean;
}> = ({ isOpen, onConfirm, onCancel, isLoggingOut }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoggingOut) onCancel();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel, isLoggingOut]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={!isLoggingOut ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg shadow-2xl border border-slate-700">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">
              {isLoggingOut ? "Logging out..." : "Confirm Logout"}
            </h3>
            {!isLoggingOut && (
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="h-6 w-6 text-red-400" />
                )}
              </div>
              <div className="text-left">
                {isLoggingOut ? (
                  <>
                    <p className="text-slate-200 font-medium">Logging out...</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Please wait while we secure your session.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-200 font-medium">
                      Are you sure you want to logout?
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      You will need to login again to access your account.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {!isLoggingOut && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-900/50 rounded-b-lg">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Yes, Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    confirmLogout,
    handleLogout,
    cancelLogout,
    isDialogOpen,
    isLoggingOut,
  } = useLogoutWithConfirmation(navigate);

  return (
    <>
      <div className="w-48 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen flex flex-col">
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
          <button
            onClick={confirmLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition group border border-transparent hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-sm font-bold">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isDialogOpen}
        onConfirm={handleLogout}
        onCancel={cancelLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default Sidebar;
