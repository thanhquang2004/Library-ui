import { useNavigate } from "react-router-dom";
import { FaBook, FaUserEdit, FaLayerGroup, FaCopy } from "react-icons/fa";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function ResourceManagementPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const resources = [
    {
      title: "Sách",
      description: "Quản lý danh mục sách trong thư viện",
      icon: <FaBook className="text-blue-500 text-3xl" />,
      path: "/books-list",
    },
    {
      title: "Tác giả",
      description: "Quản lý thông tin tác giả",
      icon: <FaUserEdit className="text-green-500 text-3xl" />,
      path: "/authors-list",
    },
    {
      title: "Kệ sách",
      description: "Quản lý vị trí, kệ chứa sách",
      icon: <FaLayerGroup className="text-purple-500 text-3xl" />,
      path: "/racks-list",
    },
    {
      title: "Bản sao sách",
      description: "Quản lý bản sao, tình trạng sách",
      icon: <FaCopy className="text-orange-500 text-3xl" />,
      path: "/bookitems-list",
    },
  ];

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý tài nguyên thư viện</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div
              key={res.title}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer flex items-center gap-4 transition"
              onClick={() => navigate(res.path)}
            >
              {res.icon}
              <div>
                <h2 className="text-lg font-semibold">{res.title}</h2>
                <p className="text-gray-500 text-sm">{res.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
