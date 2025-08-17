// src/pages/AccountPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import SidebarLayout from '../components/Sidebar';
import MainContent from '../components/Maincontent';
import axios from 'axios';

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

const API_BASE = import.meta.env.VITE_API_BASE;

const AccountPage = () => {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <SidebarLayout
      user={userData ? { name: userData.name, role: userData.role } : null}
      isLoading={isLoading}
    >
      <MainContent 
        userData={userData} 
        isLoading={isLoading} 
      />
    </SidebarLayout>
  );
};

export default AccountPage;
