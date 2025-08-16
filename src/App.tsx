import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; 
import AccountPage from "./pages/AccountPage";

// 👇 Librarian Dashboard
import DashboardPage from "./pages/LibrarianDashboard/DashboardPage";
import BooksPage from "./pages/LibrarianDashboard/BooksPage";
import BorrowReturnPage from "./pages/LibrarianDashboard/BorrowReturnPage";
import ReadersPage from "./pages/LibrarianDashboard/ReadersPage";
import ReportsPage from "./pages/LibrarianDashboard/ReportsPage";
import FinesPage from "./pages/LibrarianDashboard/FinesPage";

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

          {/* Chỉ admin hoặc librarian mới vào được */}
          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />

          {/* Librarian Dashboard + các route con */}
          <Route
            path="/librarian/*"
            element={
              <ProtectedRoute allowedRoles={["librarian"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route path="books" element={<BooksPage />} />
            <Route path="borrow-return" element={<BorrowReturnPage />} />
            <Route path="readers" element={<ReadersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="fines" element={<FinesPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
