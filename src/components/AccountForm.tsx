import React, { useState, useEffect } from 'react';
import Skeleton_ui from './Skeleton';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

interface UserData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AccountFormProps {
  userData: UserData | null;
  isLoading: boolean;
}

const AccountForm = ({ userData, isLoading }: AccountFormProps) => {
  const { user, token, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Số điện thoại phải có đúng 10 chữ số!");
      return;
    }

    if (!user || !token) {
      console.error("Không tìm thấy user hoặc token");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();

  const { currentPassword, newPassword, confirmPassword } = passwordForm;

  // Regex kiểm tra độ mạnh của mật khẩu mới
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    alert(
      "Mật khẩu mới phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số, 1 ký tự đặc biệt (@$!%*?&) và tối thiểu 8 ký tự."
    );
    return;
  }

  // So sánh mật khẩu mới và xác nhận
  if (newPassword !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE}/users/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200 && res.data.success) {
      alert("Đổi mật khẩu thành công!");
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        alert("Mật khẩu cũ không chính xác!");
      } else {
        alert(error.response.data.error || "Không thể đổi mật khẩu!");
      }
    } else {
      alert("Lỗi kết nối tới server!");
    }
  }
};


  if (isLoading) {
    return <AccountFormSkeleton />;
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 relative">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Thông tin tài khoản cá nhân
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userData?.email || ''}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="^[0-9]{10}$"
              maxLength={10}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Nút lưu & Sign Out + Change Password */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={logout}
              className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600"
            >
              Đăng xuất
            </button>

            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              className="bg-white text-gray-700 border border-gray-300 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100"
            >
              Đổi mật khẩu
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#00ACE8] text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>

      {/* Modal đổi mật khẩu */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mật khẩu hiện tại"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                        setShowChangePassword(false); // Ẩn modal
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Xóa form
                      }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#00ACE8] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton
const AccountFormSkeleton = () => (
  <div className="bg-white p-8 rounded-lg border border-gray-200">
    <Skeleton_ui className="h-8 w-1/3 mb-8" />
    <div className="space-y-6">
      <Skeleton_ui className="h-5 w-1/5 mb-2" />
      <Skeleton_ui className="h-12 w-full" />
      <Skeleton_ui className="h-5 w-1/5 mb-2" />
      <Skeleton_ui className="h-12 w-full" />
      <Skeleton_ui className="h-5 w-1/5 mb-2" />
      <Skeleton_ui className="h-12 w-full" />
      <Skeleton_ui className="h-5 w-1/5 mb-2" />
      <Skeleton_ui className="h-24 w-full" />
    </div>
  </div>
);

export default AccountForm;
