// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import BookListPage from "./components/BookListPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MemberManagementPage from "./pages/MemberManagementPage";
import UserDetailPage from "./components/UserDetailPage";
import RulesPage from "./pages/RulesPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";
import StatisticsPage from "./pages/StatisticsPage";
import LibraryManagementPage from "./pages/ResourceManagementPage.tsx";
import BookManagementPage from "./pages/BookManagementPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Yêu cầu đăng nhập */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* Sách: Toàn bộ user đã login */}
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BookListPage />
              </ProtectedRoute>
            }
          />
          
          
          
          

          {/* Quản lý Thư viện: chỉ admin hoặc librarian */}
          <Route
            path="/library-management"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <LibraryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <BookManagementPage />
              </ProtectedRoute>
            }
          />

          

          

          {/* Các Route đã có từ trước */}
          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management_member"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <MemberManagementPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <UserDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rules"
            element={
              <ProtectedRoute>
                <RulesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/system-settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SystemSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/statistics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <StatisticsPage />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;