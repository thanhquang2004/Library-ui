// import React from "react";
// import { FaBook, FaUsers, FaMoneyBill, FaChartBar, FaExchangeAlt } from "react-icons/fa";

// interface SidebarProps {
//   active: string;
//   setActive: (tab: string) => void;
// }

// const DashboardSidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
//   const menus = [
//     { key: "books", label: "Quản lý tài liệu", icon: <FaBook /> },
//     { key: "borrow", label: "Mượn/Trả", icon: <FaExchangeAlt /> },
//     { key: "readers", label: "Quản lý độc giả", icon: <FaUsers /> },
//     { key: "fees", label: "Phí & Phạt", icon: <FaMoneyBill /> },
//     { key: "reports", label: "Báo cáo", icon: <FaChartBar /> },
//   ];

//   return (
//     <div className="w-64 bg-gray-800 text-white h-screen p-4">
//       <h2 className="text-xl font-bold mb-6">📚 Librarian</h2>
//       <ul>
//         {menus.map((m) => (
//           <li
//             key={m.key}
//             onClick={() => setActive(m.key)}
//             className={`flex items-center gap-2 p-2 mb-2 cursor-pointer rounded ${
//               active === m.key ? "bg-gray-600" : "hover:bg-gray-700"
//             }`}
//           >
//             {m.icon} {m.label}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DashboardSidebar;
// import React from "react";
// import { FaBook, FaUsers, FaMoneyBill, FaChartBar, FaExchangeAlt } from "react-icons/fa";

// interface SidebarProps {
//   active: string;
//   setActive: (tab: string) => void;
// }

// const DashboardSidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
//   const menus = [
//     { key: "books", label: "Quản lý tài liệu", icon: <FaBook /> },
//     { key: "borrow", label: "Mượn/Trả", icon: <FaExchangeAlt /> },
//     { key: "readers", label: "Quản lý độc giả", icon: <FaUsers /> },
//     { key: "fees", label: "Phí & Phạt", icon: <FaMoneyBill /> },
//     { key: "reports", label: "Báo cáo", icon: <FaChartBar /> },
//   ];

//   return (
//     <div className="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen shadow-2xl border-r border-slate-700">
//       {/* Header */}
//       <div className="p-6 border-b border-slate-700">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <span className="text-xl">📚</span>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               Librarian
//             </h2>
//             <p className="text-xs text-slate-400">Hệ thống quản lý thư viện</p>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <nav className="p-4 space-y-2">
//         {menus.map((m) => (
//           <li
//             key={m.key}
//             onClick={() => setActive(m.key)}
//             className={`
//               flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 group list-none
//               ${
//                 active === m.key
//                   ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 scale-105"
//                   : "hover:bg-slate-700/50 hover:translate-x-1 hover:shadow-md"
//               }
//             `}
//           >
//             <div className={`
//               text-lg transition-all duration-200
//               ${active === m.key ? "text-white scale-110" : "text-slate-400 group-hover:text-blue-400"}
//             `}>
//               {m.icon}
//             </div>
//             <span className={`
//               font-medium transition-all duration-200
//               ${active === m.key ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"}
//             `}>
//               {m.label}
//             </span>
//             {active === m.key && (
//               <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
//             )}
//           </li>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
//         <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-sm font-bold">TB</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-white">Trần Thị B</p>
//               <p className="text-xs text-slate-400">Quản trị viên</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardSidebar;
// import React from "react";
// import { FaBook, FaUsers, FaMoneyBill, FaChartBar, FaExchangeAlt } from "react-icons/fa";

// interface SidebarProps {
//   active: string;
//   setActive: (tab: string) => void;
// }

// const DashboardSidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
//   const menus = [
//     { key: "books", label: "Quản lý tài liệu", icon: <FaBook /> },
//     { key: "borrow", label: "Mượn/Trả", icon: <FaExchangeAlt /> },
//     { key: "readers", label: "Quản lý độc giả", icon: <FaUsers /> },
//     { key: "fees", label: "Phí & Phạt", icon: <FaMoneyBill /> },
//     { key: "reports", label: "Báo cáo", icon: <FaChartBar /> },
//   ];

//   return (
//     <div className="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen shadow-2xl border-r border-slate-700">
//       {/* Header */}
//       <div className="p-6 border-b border-slate-700">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <span className="text-xl">📚</span>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               Librarian
//             </h2>
//             <p className="text-xs text-slate-400">Hệ thống quản lý thư viện</p>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <nav className="p-4 space-y-2">
//         {menus.map((m) => (
//           <li
//             key={m.key}
//             onClick={() => setActive(m.key)}
//             className={`
//               flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 group list-none
//               ${
//                 active === m.key
//                   ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 scale-105"
//                   : "hover:bg-slate-700/50 hover:translate-x-1 hover:shadow-md"
//               }
//             `}
//           >
//             <div className={`
//               text-lg transition-all duration-200
//               ${active === m.key ? "text-white scale-110" : "text-slate-400 group-hover:text-blue-400"}
//             `}>
//               {m.icon}
//             </div>
//             <span className={`
//               font-medium transition-all duration-200
//               ${active === m.key ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"}
//             `}>
//               {m.label}
//             </span>
//             {active === m.key && (
//               <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
//             )}
//           </li>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="p-6 border-t border-slate-700">
//         <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-sm font-bold">TB</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-white">Trần Thị B</p>
//               <p className="text-xs text-slate-400">Quản trị viên</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardSidebar;
// import React from "react";
// import { FaBook, FaUsers, FaMoneyBill, FaChartBar, FaExchangeAlt } from "react-icons/fa";

// interface SidebarProps {
//   active: string;
//   setActive: (tab: string) => void;
// }

// const DashboardSidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
//   const menus = [
//     { key: "books", label: "Quản lý tài liệu", icon: <FaBook /> },
//     { key: "borrow", label: "Mượn/Trả", icon: <FaExchangeAlt /> },
//     { key: "readers", label: "Quản lý độc giả", icon: <FaUsers /> },
//     { key: "fees", label: "Phí & Phạt", icon: <FaMoneyBill /> },
//     { key: "reports", label: "Báo cáo", icon: <FaChartBar /> },
//   ];

//   return (
//     <div className="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen shadow-2xl border-r border-slate-700">
//       {/* Header */}
//       <div className="p-6 border-b border-slate-700">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <span className="text-xl">📚</span>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               Librarian
//             </h2>
//             <p className="text-xs text-slate-400">Hệ thống quản lý thư viện</p>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <nav className="p-4 space-y-2">
//         {menus.map((m) => (
//           <li
//             key={m.key}
//             onClick={() => setActive(m.key)}
//             className={`
//               flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 group list-none
//               ${
//                 active === m.key
//                   ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 scale-105"
//                   : "hover:bg-slate-700/50 hover:translate-x-1 hover:shadow-md"
//               }
//             `}
//           >
//             <div className={`
//               text-lg transition-all duration-200
//               ${active === m.key ? "text-white scale-110" : "text-slate-400 group-hover:text-blue-400"}
//             `}>
//               {m.icon}
//             </div>
//             <span className={`
//               font-medium transition-all duration-200
//               ${active === m.key ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"}
//             `}>
//               {m.label}
//             </span>
//             {active === m.key && (
//               <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
//             )}
//           </li>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default DashboardSidebar;
import React from "react";
import { FaBook, FaUsers, FaMoneyBill, FaChartBar, FaExchangeAlt } from "react-icons/fa";

interface SidebarProps {
  active: string;
  setActive: (tab: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const menus = [
    { key: "books", label: "Quản lý tài liệu", icon: <FaBook /> },
    { key: "borrow", label: "Mượn/Trả", icon: <FaExchangeAlt /> },
    { key: "readers", label: "Quản lý độc giả", icon: <FaUsers /> },
    { key: "fees", label: "Phí & Phạt", icon: <FaMoneyBill /> },
    { key: "reports", label: "Báo cáo", icon: <FaChartBar /> },
  ];

  return (
    <div className="w-72 h-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Librarian
            </h2>
            <p className="text-xs text-slate-400">Hệ thống quản lý thư viện</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menus.map((m) => (
          <li
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`
              flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 group list-none
              ${
                active === m.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 scale-105"
                  : "hover:bg-slate-700/50 hover:translate-x-1 hover:shadow-md"
              }
            `}
          >
            <div
              className={`
                text-lg transition-all duration-200
                ${
                  active === m.key
                    ? "text-white scale-110"
                    : "text-slate-400 group-hover:text-blue-400"
                }
              `}
            >
              {m.icon}
            </div>
            <span
              className={`
                font-medium transition-all duration-200
                ${
                  active === m.key
                    ? "text-white font-semibold"
                    : "text-slate-300 group-hover:text-white"
                }
              `}
            >
              {m.label}
            </span>
            {active === m.key && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </li>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
