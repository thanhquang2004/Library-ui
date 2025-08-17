import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; 
import AccountPage from "./pages/AccountPage"; // Thêm dòng này
import BookListPage from "./pages/BookListPage";
import AccountPage from "./pages/AccountPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

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

          {/* Route mới cho trang danh sách sách */}
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BookListPage />
          {/* Chỉ admin hoặc librarian mới vào được */}
          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <RegisterPage />

              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
