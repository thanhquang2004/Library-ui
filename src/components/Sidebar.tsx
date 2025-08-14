import React from 'react';
import {
  FaHome, FaSearch, FaBook, FaTasks, FaChartBar, FaFileAlt,
  FaCog, FaQuestionCircle, FaSignOutAlt
} from 'react-icons/fa';
import Skeleton_ui from './Skeleton.tsx';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: { name: string; role: string } | null;
  isLoading: boolean;
  isOpen?: boolean;      // để kiểm soát mở/đóng trên mobile
  onClose?: () => void;  // để đóng Sidebar khi click overlay
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full text-left py-2.5 px-4 rounded-lg font-medium transition-colors ${
          active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="w-6 text-center">{icon}</span>
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ user, isLoading, isOpen = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay cho mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`bg-white border-r border-gray-200 flex flex-col p-4 shrink-0 z-50
        transform transition-transform duration-300
        fixed md:static top-0 left-0 h-full w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-center py-4 mb-4">LOGO</div>

        <nav className="flex-grow">
          {/* Main Menu */}
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main Menu
            </p>
            <ul className="space-y-1">
              <NavItem icon={<FaHome />} label="Home" onClick={() => navigate("/")} />
              <NavItem icon={<FaSearch />} label="Search" />
              <NavItem icon={<FaBook />} label="Books" onClick={() => navigate("/books")} />
              <NavItem icon={<FaTasks />} label="Checklist" />
              <NavItem icon={<FaChartBar />} label="Statistical" />
              <NavItem icon={<FaFileAlt />} label="Document" />
            </ul>
          </div>

          {/* Support Menu */}
          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Support
            </p>
            <ul className="space-y-1">
              <NavItem icon={<FaCog />} label="Setting" />
              <NavItem icon={<FaQuestionCircle />} label="Help" />
              <NavItem icon={<FaSignOutAlt />} label="Sign Out" onClick={handleSignOut} />
            </ul>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto">
          <div
  onClick={() => navigate("/account")}
  className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
>
  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
  <div className="ml-3 overflow-hidden">
    {isLoading ? (
      <div className="space-y-2">
        <Skeleton_ui className="h-4 w-24" />
        <Skeleton_ui className="h-3 w-16" />
      </div>
    ) : (
      <>
        <p className="font-semibold text-sm truncate" title={user?.name}>
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 truncate" title={user?.role}>
          {user?.role}
        </p>
      </>
    )}
  </div>
</div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
