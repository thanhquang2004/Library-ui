import React, { useState, useEffect } from "react";
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

const SystemSettingsPage: React.FC = () => {
  const { user,  } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    libraryName: "Thư viện ABC",
    contactInfo: "abc@library.com | 0123456789",
    
    borrowDuration: 14,
    maxBorrow: 5,
    maxRenewals: 2,
    lateFee: 5000,
    feeRule: "Tính theo ngày quá hạn",
    logo: "",
  });

  // Load settings từ localStorage khi mở trang
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSettings((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert("✅ Đã lưu cài đặt vào trình duyệt!");
  };

  // ✅ chuẩn hóa user trước khi truyền vào SidebarLayout
 

  return (
    <SidebarLayout user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">⚙️ Cài đặt hệ thống</h1>

        {/* Logo */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Logo thư viện</h2>
          {settings.logo ? (
            <img src={settings.logo} alt="Library Logo" className="h-20 object-contain" />
          ) : (
            <p className="text-gray-500">Chưa có logo</p>
          )}
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        {/* Cài đặt chung */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Cài đặt chung</h2>
          <input
            type="text"
            name="libraryName"
            value={settings.libraryName}
            onChange={handleChange}
            placeholder="Tên thư viện"
            className="w-full border rounded p-2"
          />
          <textarea
            name="contactInfo"
            value={settings.contactInfo}
            onChange={handleChange}
            placeholder="Thông tin liên hệ"
            className="w-full border rounded p-2"
          />
          
        </div>

        {/* Quy tắc mượn/trả */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Quy tắc mượn/trả</h2>
          <input
            type="number"
            name="borrowDuration"
            value={settings.borrowDuration}
            onChange={handleChange}
            placeholder="Thời gian mượn mặc định (ngày)"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            name="maxBorrow"
            value={settings.maxBorrow}
            onChange={handleChange}
            placeholder="Số lượng tài liệu tối đa"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            name="maxRenewals"
            value={settings.maxRenewals}
            onChange={handleChange}
            placeholder="Số lần gia hạn tối đa"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Phí phạt */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold">Thiết lập phí phạt</h2>
          <input
            type="number"
            name="lateFee"
            value={settings.lateFee}
            onChange={handleChange}
            placeholder="Mức phí phạt (VNĐ/ngày)"
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            name="feeRule"
            value={settings.feeRule}
            onChange={handleChange}
            placeholder="Quy tắc tính phí"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Lưu cài đặt
        </button>
      </div>
    </SidebarLayout>
  );
};

export default SystemSettingsPage;
