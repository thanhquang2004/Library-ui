import React, { useState, useEffect } from "react";
import { FaHome, FaBook, FaChartBar, FaQuestionCircle, FaUserCircle, FaUserPlus, FaBars } from "react-icons/fa";
import Skeleton_ui from "./Skeleton.tsx";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  user: { name: string; role: string } | null;
  isLoading: boolean;
  children: React.ReactNode;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className="flex items-center w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors text-gray-600 hover:bg-gray-100"
    >
      <span className="w-6 text-center">{icon}</span>
      <span className="ml-3">{label}</span>
    </button>
  </li>
);

const SidebarLayout: React.FC<SidebarProps> = ({ user, isLoading, children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth < 768;

    if (mobile && !isMobile && sidebarOpen) {
      // desktop -> mobile: tự đóng nếu đang mở
      setSidebarOpen(false);
    }
    // mobile -> desktop: giữ trạng thái hiện tại

    setIsMobile(mobile);
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // chạy lần đầu để set trạng thái đúng

  return () => window.removeEventListener("resize", handleResize);
}, [isMobile, sidebarOpen]);



  const sidebarWidth = 256;

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          ${isMobile ? "fixed z-50 top-0 left-0 h-full" : "relative h-full"}`}
        style={{
          width: sidebarOpen ? sidebarWidth : 0,
          transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {sidebarOpen && (
          <>
            {/* Logo + Toggle */}
            <div className="flex items-center justify-between text-xl font-bold p-4 border-b border-gray-200">
              <span>LOGO</span>
              {!isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <FaBars />
                </button>
              )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto">
              <div className="mt-4">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Menu chính
                </p>
                <ul className="space-y-1">
                  <NavItem icon={<FaHome />} label="Trang Chủ" onClick={() => navigate("/")} />
                  <NavItem icon={<FaBook />} label="Thư Viện" />
                  <NavItem icon={<FaChartBar />} label="Thống kê" />
                  {user && (user.role === "admin" || user.role === "librarian") && (
                    <NavItem icon={<FaUserPlus />} label="Thêm thành viên" onClick={() => navigate("/register")} />
                  )}
                </ul>
              </div>

              <div className="mt-6">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Liên hệ hỗ trợ</p>
                <ul className="space-y-1">
                  <NavItem icon={<FaQuestionCircle />} label="Trợ giúp" />
                </ul>
              </div>
            </nav>

            {/* User */}
            <div className="flex-shrink-0 w-full mt-auto">
              <div
                onClick={() => navigate("/account")}
                className="flex items-center w-full cursor-pointer hover:bg-blue-50 transition-colors p-3 rounded-lg border-t border-gray-200"
              >
                <FaUserCircle className="w-12 h-12 text-gray-400 flex-shrink-0" />
                <div className="ml-3 overflow-hidden">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton_ui className="h-4 w-24" />
                      <Skeleton_ui className="h-3 w-16" />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-sm truncate" title={user?.name}>{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate" title={user?.role}>{user?.role}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Toggle button (desktop + mobile) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <FaBars />
        </button>
      )}

      {/* Main content */}
      <main className="flex-1 transition-all duration-300" style={{ minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
