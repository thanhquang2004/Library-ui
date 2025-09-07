// src/pages/LibraryCardManagementPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

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
  const { user, token, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Record<string, LibraryCard | null>>({});

  // 🔹 Lấy danh sách user
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userList: User[] = Array.isArray(res.data)
        ? res.data
        : res.data.users || res.data.data?.users || [];

      console.log("👉 Users:", userList);
      setUsers(userList);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔹 Chỉ librarian mới fetch card
  const fetchCardByUser = async (u: User) => {
    if (user?.role !== "librarian") return; // admin không gọi API này
    try {
      const res = await axios.get(`${API_BASE}/library-cards/user/${u._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      console.log("📤 Creating card:", body);

      await axios.post(`${API_BASE}/library-cards`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error creating card:", err);
    }
  };

  // 🔹 Đổi trạng thái (admin + librarian)
  const handleToggleStatus = async (cardNumber: string, u: User) => {
    try {
      await axios.put(
        `${API_BASE}/library-cards/${cardNumber}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error toggling card status:", err);
    }
  };

  // 🔹 Xóa thẻ (admin + librarian)
  const handleDeleteCard = async (cardNumber: string, u: User) => {
    try {
      await axios.delete(`${API_BASE}/library-cards/${cardNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (user?.role === "librarian") fetchCardByUser(u);
    } catch (err) {
      console.error("❌ Error deleting card:", err);
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
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Tên</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>

                {/* Librarian mới thấy cột mã thẻ/trạng thái */}
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

                    {/* Librarian mới xem được chi tiết thẻ */}
                    {user?.role === "librarian" && (
                      <>
                        <td className="border px-4 py-2">
                          {card
                            ? card.cardNumber
                            : card === null
                            ? "Chưa có thẻ"
                            : "Chưa tải"}
                        </td>
                        <td className="border px-4 py-2">
                          {card
                            ? card.active
                              ? "Hoạt động"
                              : "Khóa"
                            : "-"}
                        </td>
                      </>
                    )}

                    <td className="border px-4 py-2 space-x-2">
                      {/* Librarian: xem / tạo / đổi trạng thái / xóa */}
                      {user?.role === "librarian" && (
                        <>
                          {card === undefined ? (
                            <button
                              onClick={() => fetchCardByUser(u)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            >
                              Xem thẻ
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
                                onClick={() =>
                                  handleToggleStatus(card.cardNumber, u)
                                }
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                              >
                                {card.active ? "Khóa" : "Mở"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCard(card.cardNumber, u)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </>
                      )}

                      {/* Admin: chỉ tạo / đổi trạng thái / xóa, không xem */}
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleCreateCard(u)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md"
                          >
                            Tạo thẻ
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus("DUMMY", u) // admin không có cardNumber thật
                            }
                            disabled
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md opacity-50 cursor-not-allowed"
                          >
                            Khóa/Mở
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCard("DUMMY", u) // admin không có cardNumber thật
                            }
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
        )}
      </div>
    </SidebarLayout>
  );
};

export default LibraryCardManagementPage;
