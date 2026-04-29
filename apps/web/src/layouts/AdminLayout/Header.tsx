// import React from "react";
// import { useAuth } from "../../hooks/useAuth";

// const AdminHeader: React.FC = () => {
//   const { user } = useAuth();

//   return (
//     <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex-shrink-0">
//       <div className="mx-auto flex h-16 w-full items-center justify-end px-6 lg:px-8">
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-4">
//             <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
//             <div className="flex items-center gap-3">
//               <div className="text-right hidden sm:block">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Admin</p>
//                 <p className="text-sm font-semibold text-slate-800 leading-none">{user?.username || 'Loading...'}</p>
//               </div>
//               <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-emerald-500 overflow-hidden relative">
//                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'Admin'}&backgroundColor=e2e8f0`} alt="Profile" className="object-cover w-full h-full" />
//                 <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth"; 

const AdminHeader: React.FC<{ onToggleSidebar: () => void; isSidebarCollapsed: boolean }> = ({ 
  onToggleSidebar, 
  isSidebarCollapsed 
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:px-8">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-slate-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          )}
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Admin</p>
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.username || 'Loading...'}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-emerald-500 overflow-hidden relative">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'Admin'}&backgroundColor=e2e8f0`} alt="Profile" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;