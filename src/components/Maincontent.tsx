
import AccountForm from './AccountForm';

// Định nghĩa props để nhận dữ liệu
interface MainContentProps {
  userData: UserData | null;// Thay any bằng kiểu dữ liệu cụ thể
  isLoading: boolean;
}
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

const MainContent = ({ userData, isLoading }: MainContentProps) => {
  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      {/* Header không thay đổi nhiều */}
      <header className="flex justify-between items-center mb-8">
        {/* ... */}
      </header>

      {/* Truyền props xuống AccountForm */}
      <AccountForm userData={userData} isLoading={isLoading} />
    </main>
  );
};

export default MainContent;