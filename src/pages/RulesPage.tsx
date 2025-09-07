import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

interface SystemSettings {
  libraryName: string;
  contactInfo: string;
  borrowDuration: number;
  maxBorrow: number;
  maxRenewals: number;
  lateFee: number;
  feeRule: string;
  logo?: string;
}

const STORAGE_KEY = "system_settings";

const RulesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      setSettings({
        libraryName: "Thư viện ABC",
        contactInfo: "abc@library.com | 0123456789",
        
        borrowDuration: 14,
        maxBorrow: 5,
        maxRenewals: 2,
        lateFee: 5000,
        feeRule: "Tính theo ngày quá hạn",
        logo: "",
      });
    }
  }, []);

  if (!settings) return <p className="p-6">Đang tải quy định...</p>;

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="flex justify-center p-6">
        <div className="max-w-3xl w-full space-y-6">
          {/* Phần giới thiệu */}
          <div className="bg-blue-50 p-4 rounded-xl shadow text-center">
            <h1 className="text-2xl font-bold mb-2">📚 Hệ thống Quản lý Thư viện</h1>
            <p className="text-gray-600">
              Đây là dự án quản lý thư viện do <strong>nhóm sinh viên Khóa 22, lớp CN22H </strong> 
              của <strong> Đại học Giao thông Vận tải TP.HCM</strong> thực hiện.
            </p>
          </div>

          {/* Thông tin chung */}
          <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold">Thông tin chung</h2>
            {settings.logo && (
              <img
                src={settings.logo}
                alt="Library Logo"
                className="h-16 object-contain mx-auto"
              />
            )}
            <p>
              <strong>Tên thư viện:</strong> {settings.libraryName}
            </p>
            <p>
              <strong>Liên hệ:</strong> {settings.contactInfo}
            </p>
          </div>

          {/* Quy tắc mượn trả */}
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold">Quy tắc mượn / trả</h2>
            <p>
              - Thời gian mượn mặc định:{" "}
              <strong>{settings.borrowDuration} ngày</strong>
            </p>
            <p>
              - Số lượng tài liệu tối đa: <strong>{settings.maxBorrow}</strong>
            </p>
            <p>
              - Số lần gia hạn tối đa:{" "}
              <strong>{settings.maxRenewals}</strong>
            </p>
          </div>

          {/* Phí phạt */}
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold">Phí phạt</h2>
            <p>
              - Mức phí phạt:{" "}
              <strong>{settings.lateFee.toLocaleString()} VNĐ / ngày</strong>
            </p>
            <p>- Quy tắc tính phí: {settings.feeRule}</p>
          </div>

          {/* Nếu admin thì cho chỉnh sửa */}
          {user?.role === "admin" && (
            <div className="text-center">
              <button
                onClick={() => navigate("/system-settings")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Chỉnh sửa quy định
              </button>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default RulesPage;
