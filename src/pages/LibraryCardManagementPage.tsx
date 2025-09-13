// src/pages/LibraryCardManagementPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api";

interface User {
  _id: string;
  email: string;
  username: string;
  name?: string;
  role: string;
}

interface LibraryCard {
  _id: string;
  cardNumber: string;
  userId: string;
  active: boolean;
  deleted?: boolean;
}

const LibraryCardManagementPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Record<string, LibraryCard | null | undefined>>({});

  // States mới cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Số lượng user mỗi trang

  // 🔹 Lấy danh sách user có phân trang
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${currentPage}&limit=${pageSize}`);

      const userList: User[] = Array.isArray(res.data.data.users)
        ? res.data.data.users
        : res.data.data?.users || [];
      const totalUsers = res.data.data.total;

      setUsers(userList);
      setTotalPages(Math.ceil(totalUsers / pageSize));
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Dependency là currentPage để tự động load lại khi chuyển trang

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔹 Chỉ librarian mới fetch card
  const fetchCardByUser = async (u: User) => {
    if (user?.role !== "librarian") return;
    try {
      // Đặt giá trị undefined để hiển thị trạng thái đang tải
      setCards((prev) => ({ ...prev, [u._id]: undefined }));

      const res = await api.get(`/library-cards/user/${u._id}`);
      setCards((prev) => ({ ...prev, [u._id]: res.data }));
    } catch {
      setCards((prev) => ({ ...prev, [u._id]: null }));
    }
  };

  // 🔹 Tạo thẻ mới (admin + librarian)
  const handleCreateCard = async (u: User) => {
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const cardNumber = `LIB${randomNum}`;
      const body = { cardNumber, userId: u._id };

      await api.post("/library-cards", body);
      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error creating card:", err);
    }
  };

  // 🔹 Đổi trạng thái (admin + librarian)
  const handleToggleStatus = async (cardNumber: string, u: User) => {
    try {
      await api.put(`/library-cards/${cardNumber}/toggle-status`, {});
      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error toggling card status:", err);
    }
  };

  // 🔹 Xóa thẻ (admin + librarian)
  const handleDeleteCard = async (cardNumber: string, u: User) => {
    try {
      await api.delete(`/library-cards/${cardNumber}`);
      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error deleting card:", err);
    }
  };

  // Hàm chuyển trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Quản lý thẻ thư viện</h1>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Tên</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  {user?.role === "librarian" && (
                    <>
                      <th className="border px-4 py-2">Mã thẻ</th>
                      <th className="border px-4 py-2">Trạng thái</th>
                    </>
                  )}
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const card = cards[u._id];
                  return (
                    <tr key={u._id} className="text-center">
                      <td className="border px-4 py-2">
                        {u.name || u.username}
                      </td>
                      <td className="border px-4 py-2">{u.email}</td>
                      <td className="border px-4 py-2">{u.role}</td>

                      {user?.role === "librarian" && (
                        <>
                          <td className="border px-4 py-2">
                            {card === undefined
                              ? "Đang tải..."
                              : card
                                ? card.cardNumber
                                : "Chưa có thẻ"}
                          </td>
                          <td className="border px-4 py-2">
                            {card === undefined
                              ? "-"
                              : card
                                ? card.active
                                  ? "Hoạt động"
                                  : "Khóa"
                                : "-"}
                          </td>
                        </>
                      )}
                      <td className="border px-4 py-2 space-x-2">
                        {user?.role === "librarian" && (
                          <>
                            {card === undefined ? (
                              <button
                                className="bg-gray-400 text-white px-3 py-1 rounded-md"
                                disabled
                              >
                                Đang tải...
                              </button>
                            ) : !card ? (
                              <button
                                onClick={() => handleCreateCard(u)}
                                className="bg-green-500 text-white px-3 py-1 rounded-md"
                              >
                                Tạo thẻ
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleToggleStatus(card.cardNumber, u)}
                                  className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                                >
                                  {card.active ? "Khóa" : "Mở"}
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.cardNumber, u)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                  Xóa
                                </button>
                              </>
                            )}
                          </>
                        )}
                        {user?.role === "admin" && (
                          <>
                            <button
                              onClick={() => handleCreateCard(u)}
                              className="bg-green-500 text-white px-3 py-1 rounded-md"
                            >
                              Tạo thẻ
                            </button>
                            <button
                              onClick={() => handleToggleStatus("DUMMY", u)}
                              disabled
                              className="bg-yellow-500 text-white px-3 py-1 rounded-md opacity-50 cursor-not-allowed"
                            >
                              Khóa/Mở
                            </button>
                            <button
                              onClick={() => handleDeleteCard("DUMMY", u)}
                              disabled
                              className="bg-red-500 text-white px-3 py-1 rounded-md opacity-50 cursor-not-allowed"
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Trang trước
              </button>
              <span>
                Trang {currentPage} trên {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </>
        )}
      </div>
    </SidebarLayout>
  );
};

export default LibraryCardManagementPage;