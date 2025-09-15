// src/pages/AccountPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import SidebarLayout from '../components/Sidebar';
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

import api from '../api';

const AccountPage = () => {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/users/${user.id}`, {
      
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
