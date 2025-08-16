import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/Sidebar";
import DashboardHeader from "../../components/librarian/DashboardHeader";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

interface UserData {
  userId: string;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
  address: string;
  phone: string;
  preferences: string;
  language: string;
}

const API_BASE = import.meta.env.VITE_API_BASE;

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  const librarianButtons = [
    { label: "📚 Quản lý tài liệu", path: "/librarian/books" },
    { label: "🔄 Mượn / Trả", path: "/librarian/borrow-return" },
    { label: "👥 Quản lý độc giả", path: "/librarian/readers" },
    { label: "💰 Phí & Phạt", path: "/librarian/fines" },
    { label: "📊 Báo cáo", path: "/librarian/reports" },
  ];

  return (
    <SidebarLayout
      user={userData ? { name: userData.name, role: userData.role } : null}
      isLoading={isLoading}
    >
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="p-6 overflow-y-auto">
          {/* Luôn hiện nút khi là thủ thư */}
          {userData?.role === "librarian" && (
            <div className="flex flex-wrap gap-4 mb-6">
              {librarianButtons.map((btn) => (
                <button
                  key={btn.path}
                  onClick={() => navigate(btn.path)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Render các trang con */}
          <Outlet context={{ token, user: userData }} />
        </main>
      </div>
    </SidebarLayout>
  );
}
