import React, { useState, useEffect } from 'react';
import Skeleton_ui from './Skeleton';

// Định nghĩa kiểu dữ liệu cho user
interface UserData {
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
  // State để quản lý giá trị của các input trong form
  const [formData, setFormData] = useState<Omit<UserData, 'name' | 'email'>>({
    phone: '',
    address: '',
  });

  // Khi userData từ props có dữ liệu (sau khi API gọi xong),
  // cập nhật state của form
  useEffect(() => {
    if (userData) {
      setFormData({
        phone: userData.phone,
        address: userData.address,
      });
    }
  }, [userData]); // Chạy lại khi props.userData thay đổi

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ----- BẮT ĐẦU XỬ LÝ API KHI SUBMIT -----
    // console.log('Dữ liệu gửi lên API:', formData);
    // const apiEndpoint = '/api/user/update';
    // fetch(apiEndpoint, {
    //   method: 'PUT', // Hoặc PATCH
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // })
    // .then(res => res.json())
    // .then(data => {
    //   console.log('API response:', data);
    //   alert('Cập nhật thành công!');
    // })
    // .catch(error => {
    //   console.error('Lỗi khi cập nhật:', error);
    //   alert('Có lỗi xảy ra!');
    // });
    // ----- KẾT THÚC XỬ LÝ API KHI SUBMIT -----
    alert(`Đã gửi dữ liệu cập nhật: ${JSON.stringify(formData)}`);
  };

  // Nếu đang loading, hiển thị giao diện skeleton
  if (isLoading) {
    return <AccountFormSkeleton />;
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold mb-8 text-center">Thông tin tài khoản cá nhân</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
            <input type="text" id="name" value={userData?.name || ''} readOnly className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" value={userData?.email || ''} readOnly className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <textarea id="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md"/>
          </div>
        </div>
        <div className="mt-8 text-right">
          <button type="submit" className="bg-[#00ACE8] text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
};

// Component con cho giao diện skeleton của form
const AccountFormSkeleton = () => (
  <div className="bg-white p-8 rounded-lg border border-gray-200">
    <Skeleton_ui className="h-8 w-1/3 mb-8" />
    <div className="space-y-6">
      <div>
        <Skeleton_ui className="h-5 w-1/5 mb-2" />
        <Skeleton_ui className="h-12 w-full" />
      </div>
       <div>
        <Skeleton_ui className="h-5 w-1/5 mb-2" />
        <Skeleton_ui className="h-12 w-full" />
      </div>
       <div>
        <Skeleton_ui className="h-5 w-1/5 mb-2" />
        <Skeleton_ui className="h-12 w-full" />
      </div>
       <div>
        <Skeleton_ui className="h-5 w-1/5 mb-2" />
        <Skeleton_ui className="h-24 w-full" />
      </div>
    </div>
  </div>
);


export default AccountForm;