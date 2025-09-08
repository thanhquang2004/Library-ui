import React, { useState, useEffect } from "react";
import { 
  FaHome, FaBook, FaChartBar, FaQuestionCircle, 
  FaUserCircle, FaUserPlus, FaBars, FaCog, FaGavel, FaExchangeAlt
} from "react-icons/fa";
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
  const [logo, setLogo] = useState<string | null>(null);

  const sidebarWidth = 256;

  // Load logo từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("system_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setLogo(parsed.logo || null);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "system_settings" && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setLogo(parsed.logo || null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize(); // Chạy lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 overflow-y-auto
          ${isMobile ? "fixed z-50 top-0 left-0 h-full" : "relative h-full"}`}
        style={{
          width: sidebarWidth,
          transform: sidebarOpen
            ? "translateX(0)"
            : isMobile
            ? "translateX(-100%)"
            : "translateX(0)",
        }}
      >
        {/* Header: Logo + Toggle */}
        <div className="flex items-center justify-between text-xl font-bold p-4 border-b border-gray-200">
          {logo ? (
            <img src={logo} alt="Library Logo" className="h-10 object-contain" />
          ) : (
            <span>LOGO</span>
          )}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FaBars />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menu chính
          </p>
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Trang Chủ" onClick={() => navigate("/")} />
            {user && (user.role === "admin" || user.role === "librarian") && (
              <NavItem icon={<FaBook />} label="Thư Viện" onClick={() => navigate("/library-management")} />
            )}
            {user && (user.role === "admin" || user.role === "librarian") && (
            <NavItem icon={<FaExchangeAlt />} label="Quản lý mượn trả" onClick={() => navigate("/borrow-return")} />
  )}
            {user && user.role === "admin" && (
              <NavItem icon={<FaChartBar />} label="Thống kê" onClick={() => navigate("/statistics")} />
            )}
            {user && (user.role === "admin" || user.role === "librarian") && (
              <NavItem icon={<FaUserCircle />} label="Quản lý thành viên" onClick={() => navigate("/management_member")} />
            )}
            <NavItem icon={<FaBook />} label="Book List" onClick={() => navigate("/books")} />
            {user && (user.role === "admin" || user.role === "librarian") && (
              <NavItem icon={<FaUserPlus />} label="Thêm thành viên" onClick={() => navigate("/register")} />
            )}
            {user && (
              <NavItem icon={<FaGavel />} label="Quy định" onClick={() => navigate("/rules")} />
            )}
            {user && user.role === "admin" && (
              <NavItem icon={<FaCog />} label="Cài đặt hệ thống" onClick={() => navigate("/system-settings")} />
            )}
          </ul>


          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">
            Liên hệ hỗ trợ
          </p>
          <ul className="space-y-1">
            <NavItem icon={<FaQuestionCircle />} label="Trợ giúp" />
          </ul>
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
      </aside>

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Toggle button for mobile */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <FaBars />
        </button>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;