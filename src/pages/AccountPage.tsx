// src/AccountPage.tsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/Maincontent';

interface UserData {
  userId: string;
  name: string;
  email: string;
  role: 'member' | 'librarian' | 'admin';
  address: string;
  phone: string;
  preferences: string;
  language: string;
}

// Define a complete mock data object to match the UserData interface
const MOCK_USER_DATA: UserData = {
  userId: '12345',
  name: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  phone: '0987654321',
  address: '123 Đường ABC, Phường X, Quận Y, TP.HCM',
  role: 'member', // Use a valid role from the interface
  preferences: 'notifications_on',
  language: 'vi',
};

const AccountPage = () => {
  // Use the full UserData interface for the state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // --- BẮT ĐẦU PHẦN GIẢ LẬP DỮ LIỆU ĐỂ HIỂN THỊ GIAO DIỆN ---
    // Comment lại phần gọi API thật
    // const fetchUserData = async () => {
    //   try {
    //     const res = await fetch('/api/users/' + MOCK_USER_DATA.userId);
    //     if (!res.ok) throw new Error('Failed to fetch user data');
    //     const { data } = await res.json();
    //     setUserData(data);
    //   } catch (error) {
    //     console.error("Lỗi khi fetch dữ liệu:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // setTimeout để giả lập thời gian tải
    const timer = setTimeout(() => {
      setUserData(MOCK_USER_DATA); // Gán dữ liệu giả lập
      setIsLoading(false);
    }, 1500);

    // Dọn dẹp timer khi component unmount
    return () => clearTimeout(timer);
    // --- KẾT THÚC PHẦN GIẢ LẬP ---
    
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Trong Sidebar, chỉ cần truyền name và role. 
        Sử dụng Optional Chaining (?) để tránh lỗi nếu userData là null
      */}
      <Sidebar 
        user={userData ? { name: userData.name, role: userData.role } : null} 
        isLoading={isLoading} 
      />
      {/* Truyền toàn bộ đối tượng userData xuống MainContent
      */}
      <MainContent 
        userData={userData} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default AccountPage;