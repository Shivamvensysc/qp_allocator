// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   SlidersHorizontal,
//   Settings,
//   LogOut,
//   Plus,
// } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useToast } from "../../hooks/useToast";

// const navItems = [
//   {
//     href: "/admin",
//     label: "Dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     href: "/admin/adminselectorcontroller",
//     label: "Selector Controls",
//     icon: SlidersHorizontal,
//   },
// ];

// // Custom hook for logout confirmation
// const useLogoutWithConfirmation = () => {
//   const { toast } = useToast();
//   const { logout } = useAuth();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const confirmLogout = () => {
//     setIsDialogOpen(true);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsDialogOpen(false);
//       toast.success("Logged out successfully!");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const cancelLogout = () => {
//     setIsDialogOpen(false);
//   };

//   return {
//     confirmLogout,
//     handleLogout,
//     cancelLogout,
//     isDialogOpen,
//   };
// };

// // Confirmation Modal Component
// const LogoutConfirmationModal: React.FC<{
//   isOpen: boolean;
//   onConfirm: () => void;
//   onCancel: () => void;
// }> = ({ isOpen, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   // Handle escape key press
//   React.useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onCancel();
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//       // Prevent body scroll when modal is open
//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, onCancel]);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
//         onClick={onCancel}
//       />

//       {/* Modal */}
//       <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 animate-in zoom-in-95 duration-200">
//         <div className="bg-[#0b1727] rounded-lg shadow-2xl border border-[#223f61]">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-[#223f61]">
//             <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
//             <button
//               onClick={onCancel}
//               className="text-slate-400 hover:text-white transition-colors"
//               aria-label="Close"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Body */}
//           <div className="p-6">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
//                 <LogOut className="h-6 w-6 text-red-400" />
//               </div>
//               <div className="text-left">
//                 <p className="text-slate-200 font-medium">
//                   Are you sure you want to logout?
//                 </p>
//                 <p className="text-sm text-slate-400 mt-1">
//                   You will need to login again to access your account.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-end gap-3 p-6 border-t border-[#223f61] bg-[#0f1a28] rounded-b-lg">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1b2b3b] rounded-md transition-colors"
//               autoFocus
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0b1727]"
//             >
//               Yes, Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const AdminSidebar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { confirmLogout, handleLogout, cancelLogout, isDialogOpen } =
//     useLogoutWithConfirmation();
//   const pathname = location.pathname;

//   return (
//     <>
//       <aside className="hidden md:flex md:w-64 flex-col bg-[#0b1727] text-slate-100 shadow-xl h-screen">
//         <div className="flex flex-col h-full overflow-hidden">
//           {/* Logo */}
//           <div className="px-6 py-4 flex flex-col gap-1 flex-shrink-0">
//             <h1 className="text-xl font-bold tracking-wide text-white">
//               UPESSC
//             </h1>
//             <p className="text-[13px]">Government of Uttar Pradesh</p>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 overflow-hidden space-y-1 flex flex-col px-3 py-2 mt-4">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = pathname === item.href;

//               return (
//                 <Link
//                   key={item.href}
//                   to={item.href}
//                   className={`group flex items-center gap-4 py-3 px-4 text-sm font-medium transition-all ${
//                     active
//                       ? "bg-[#1b2b3b]/60 text-emerald-400 border-l-[3px] border-emerald-400"
//                       : "text-slate-300 hover:bg-[#1b2b3b]/40 hover:text-white border-l-[3px] border-transparent"
//                   }`}
//                 >
//                   <Icon
//                     className={`h-5 w-5 flex-shrink-0 ${
//                       active
//                         ? "text-emerald-400"
//                         : "text-slate-400 group-hover:text-slate-300"
//                     }`}
//                   />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* New Exam Button */}
//           <div className="px-5 py-4 flex-shrink-0">
//             <button
//               onClick={() => navigate("/admin/examconfigration")}
//               className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#162c46] hover:bg-[#1b3452] border border-[#223f61] px-4 py-2.5 text-xs font-semibold text-emerald-400 transition"
//             >
//               <Plus className="h-4 w-4" />
//               New Exam
//             </button>
//           </div>

//           {/* Bottom Section */}
//           <div className="px-5 py-6 flex-shrink-0 space-y-2 mt-auto">
//             <Link
//               to="/admin/settings"
//               className="flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition"
//             >
//               <Settings className="h-5 w-5 text-slate-400" />
//               <span>Settings</span>
//             </Link>

//             <button
//               onClick={confirmLogout}
//               className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition group"
//               aria-label="Logout"
//             >
//               <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
//               <span className="group-hover:text-red-400 transition-colors">
//                 Logout
//               </span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Logout Confirmation Modal */}
//       <LogoutConfirmationModal
//         isOpen={isDialogOpen}
//         onConfirm={handleLogout}
//         onCancel={cancelLogout}
//       />
//     </>
//   );
// };

// export default AdminSidebar;


import React, { useState } from "react";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

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

// Custom hook for logout confirmation
const useLogoutWithConfirmation = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirmLogout = () => {
    setIsDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDialogOpen(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
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
  };
};

// Confirmation Modal Component
const LogoutConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 animate-in zoom-in-95 duration-200">
        <div className="bg-[#0b1727] rounded-lg shadow-2xl border border-[#223f61]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#223f61]">
            <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
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
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-slate-200 font-medium">
                  Are you sure you want to logout?
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  You will need to login again to access your account.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#223f61] bg-[#0f1a28] rounded-b-lg">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1b2b3b] rounded-md transition-colors"
              autoFocus
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0b1727]"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AdminSidebar: React.FC<{ isCollapsed: boolean; onToggle: () => void }> = ({ 
  isCollapsed, 
  
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmLogout, handleLogout, cancelLogout, isDialogOpen } =
    useLogoutWithConfirmation();
  const pathname = location.pathname;

  return (
    <>
      <aside 
        className={`hidden md:flex flex-col bg-[#0b1727] text-slate-100 shadow-xl h-screen transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-56'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className={`px-6 py-4 flex flex-col gap-1 flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? 'items-center px-2' : ''
          }`}>
            {!isCollapsed ? (
              <>
                <h1 className="text-xl font-bold tracking-wide text-white">
                  UPESSC
                </h1>
                <p className="text-[13px]">Government of Uttar Pradesh</p>
              </>
            ) : (
              <h1 className="text-xl font-bold tracking-wide text-white">
                UPESE
              </h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-hidden space-y-1 flex flex-col px-3  mt-2">
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
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      active
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* New Exam Button */}
          <div className={`px-5 py-4 flex-shrink-0 ${isCollapsed ? 'px-2' : ''}`}>
            <button
              onClick={() => navigate("/admin/examconfigration")}
              className={`w-full inline-flex items-center justify-center gap-2 rounded bg-[#162c46] hover:bg-[#1b3452] border border-[#223f61] px-4 py-2.5 text-xs font-semibold text-emerald-400 transition ${
                isCollapsed ? 'px-2' : ''
              }`}
              title={isCollapsed ? "New Exam" : undefined}
            >
              <Plus className="h-4 w-4" />
              {!isCollapsed && "New Exam"}
            </button>
          </div>

          {/* Bottom Section */}
          <div className="px-5 py-6 flex-shrink-0 space-y-2 mt-auto">
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-5 w-5 text-slate-400" />
              {!isCollapsed && <span>Settings</span>}
            </Link>

            <button
              onClick={confirmLogout}
              className={`w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-300 hover:text-white transition group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              aria-label="Logout"
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              {!isCollapsed && (
                <span className="group-hover:text-red-400 transition-colors">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isDialogOpen}
        onConfirm={handleLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default AdminSidebar;
