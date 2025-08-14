import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      {/* Sidebar */}
      <Sidebar
        user={user ? { name: user.username, role: user.role || "unknown", } : null}
        isLoading={false}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Nút mở sidebar chỉ hiện trên mobile */}
        <button
          className="md:hidden mb-4 text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={24} />
        </button>

        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Hello, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Chào mừng bạn quay trở lại hệ thống.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
