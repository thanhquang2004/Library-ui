import React, { useEffect, useState, useCallback } from "react";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Skeleton_ui from "../components/Skeleton";
import { Link } from "react-router-dom";
import { FiLock, FiUnlock, FiTrash2, FiEdit2 } from "react-icons/fi";
import api from "../api";


interface UserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "librarian" | "member";
  accountStatus: "active" | "blocked";
}

const MemberManagementPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // phân trang server-side
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // state cho edit modal
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    role: "" as "admin" | "librarian" | "member" | "",
    email: "",
  });

  /* ================= FETCH USERS ================= */
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/users`, {
        
        params: {
          page: currentPage,
          limit: itemsPerPage,
          role: roleFilter !== "all" ? roleFilter : undefined,
          accountStatus: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
        },
      });

      // hỗ trợ cả khi backend trả { data: { users, total } } hoặc { users, total }
      const responseData = res.data?.data || res.data;

      const apiUsers = Array.isArray(responseData?.users)
        ? responseData.users
        : [];

      setUsers(apiUsers);

      const total = responseData?.total || apiUsers.length;
      const limit = responseData?.limit || itemsPerPage;

      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setError("Không thể tải dữ liệu người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, roleFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ================= ACTIONS ================= */
  const toggleStatus = async (userId: string) => {
    try {
      await api.put(
        `/users/${userId}/toggle-status`,
        {},
        {  }
      );
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi khóa/mở:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await api.delete(`/users/${userId}`, {
       
      });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (u: UserItem) => setEditingUser(u);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        phone: editingUser.phone || "",
        address: editingUser.address || "",
        role: editingUser.role,
        email: editingUser.email || "",
      });
    }
  }, [editingUser]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      alert("Số điện thoại phải có đúng 10 chữ số!");
      return;
    }

    try {
      await api.put(
        `/users/${editingUser._id}/byAdmin`,
        formData,
        {  }
      );
      alert("Cập nhật thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Có lỗi xảy ra!");
      } else {
        alert("Có lỗi xảy ra!");
      }
    }
  };

  /* ================= RENDER ================= */
  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">
            Quản lý hồ sơ
          </h1>

          {/* Bộ lọc + Tìm kiếm */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex gap-4">
              {/* Filter Role */}
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setStatusFilter("all"); // 🔥 reset status khi đổi role
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="librarian">Librarian</option>
                <option value="member">Member</option>
              </select>

              {/* Filter Status */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setRoleFilter("all"); // 🔥 reset role khi đổi status
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="blocked">Bị khóa</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Tìm theo tên, số điện thoại..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-lg w-full md:w-1/3"
            />
          </div>

          {/* Bảng danh sách */}
          {loading ? (
            <Skeleton_ui />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
          ) : (
            <>
              <table className="w-full border-collapse border text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Tên</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Số điện thoại</th>
                    <th className="border px-4 py-2">Vai trò</th>
                    <th className="border px-4 py-2">Trạng thái</th>
                    {user?.role === "admin" && (
                      <th className="border px-4 py-2">Hành động</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <Link
                          to={`/users/${u._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {u.name}
                        </Link>
                      </td>
                      <td className="border px-4 py-2">{u.email}</td>
                      <td className="border px-4 py-2">{u.phone || "-"}</td>
                      <td className="border px-4 py-2 capitalize">{u.role}</td>
                      <td
                        className={`border px-4 py-2 ${
                          u.accountStatus === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {u.accountStatus === "active"
                          ? "Hoạt động"
                          : "Bị khóa"}
                      </td>
                      {user?.role === "admin" && (
                        <td className="border px-4 py-2 flex gap-2">
                          <button
                            onClick={() => startEdit(u)}
                            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => toggleStatus(u._id)}
                            className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                          >
                            {u.accountStatus === "active" ? (
                              <FiLock />
                            ) : (
                              <FiUnlock />
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <span>
                  Trang {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal chỉnh sửa */}
        {user?.role === "admin" && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Chỉnh sửa người dùng
              </h2>
              <form onSubmit={saveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Họ và tên</label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border w-full px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border w-full px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Số điện thoại</label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="border w-full px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Địa chỉ</label>
                  <textarea
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border w-full px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Vai trò</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="border w-full px-3 py-2 rounded"
                  >
                    <option value="librarian">Librarian</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default MemberManagementPage;
