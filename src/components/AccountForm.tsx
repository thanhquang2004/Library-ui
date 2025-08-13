import React, { useState, useEffect } from 'react';
import Skeleton_ui from './Skeleton';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

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
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Khi có dữ liệu userData từ props -> đổ vào form
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
        `http://localhost:5000/api/users/${user.id}`, // dùng id từ AuthContext
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

  if (isLoading) {
    return <AccountFormSkeleton />;
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Thông tin tài khoản cá nhân
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Họ và tên */}
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

          {/* Email */}
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

          {/* Số điện thoại */}
          <div>
  <label
    htmlFor="phone"
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    Số điện thoại
  </label>
  <input
    type="tel"
    id="phone"
    value={formData.phone}
    onChange={handleInputChange}
    pattern="^[0-9]{10}$" // Chỉ cho phép 10 chữ số
    maxLength={10}        // Giới hạn tối đa 10 ký tự
    required              // Không được để trống
    className="w-full p-3 border border-gray-300 rounded-md"
  />
</div>

          {/* Địa chỉ */}
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

        {/* Nút lưu */}
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-[#00ACE8] text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

// Skeleton khi load dữ liệu
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
