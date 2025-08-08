import React from 'react';
import {
  FaHome, FaSearch, FaBook, FaTasks, FaChartBar, FaFileAlt,
  FaCog, FaQuestionCircle, FaSignOutAlt
} from 'react-icons/fa';
import Skeleton_ui from './Skeleton.tsx'; // Đảm bảo đường dẫn này đúng

// Định nghĩa props cho Sidebar
interface SidebarProps {
  user: { name: string; role: string; } | null;
  isLoading: boolean;
}

// Component con cho mỗi mục trong menu để tái sử dụng
const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <li>
    <a
      href="#"
      className={`flex items-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="w-6 text-center">{icon}</span>
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar = ({ user, isLoading }: SidebarProps) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shrink-0">
      <div className="text-2xl font-bold text-center py-4 mb-4">LOGO</div>

      <nav className="flex-grow">
        {/* Main Menu */}
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Home"/>
            <NavItem icon={<FaSearch />} label="Search" />
            <NavItem icon={<FaBook />} label="Books" />
            <NavItem icon={<FaTasks />} label="Checklist" />
            <NavItem icon={<FaChartBar />} label="Statistical" />
            <NavItem icon={<FaFileAlt />} label="Document" />
          </ul>
        </div>

        {/* Support Menu */}
        <div>
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Support</p>
          <ul className="space-y-1">
            <NavItem icon={<FaCog />} label="Setting" />
            <NavItem icon={<FaQuestionCircle />} label="Help" />
            <NavItem icon={<FaSignOutAlt />} label="Sign Out" />
          </ul>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto">
        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
             {/* Bạn có thể thay thế bằng thẻ <img> nếu có ảnh đại diện */}
          </div>
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
  );
};

export default Sidebar;