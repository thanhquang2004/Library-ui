// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";

import DashboardPage from "./pages/DashboardPage";  // ✅ import đúng path

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
import AuthorManagementPage from "./pages/AuthorManagementPage.tsx";
import RackManagementPage from "./pages/RackManagementPage.tsx";
import BookItemManagementPage from "./pages/BookItemManagementPage.tsx";
import CategoriesListPage from "./pages/CategoriesListPage.tsx";
import LibraryCardManagementPage from "./pages/LibraryCardManagementPage.tsx";


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
          <Route
            path="/authors-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <AuthorManagementPage />
              </ProtectedRoute>
            }
          />
            <Route
            path="/racks-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <RackManagementPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookitems-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <BookItemManagementPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <CategoriesListPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowcards-list"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <LibraryCardManagementPage/>
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


          {/* Dashboard của thủ thư */}
          <Route
            path="/librarian/*"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <DashboardPage />
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