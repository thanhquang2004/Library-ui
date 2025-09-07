import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiLock, FiUnlock, FiTrash2 } from "react-icons/fi";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

/* ====================== TYPES ====================== */
interface BookItem {
  _id: string;
  title: string;
}
interface Member {
  _id: string;
  name: string;
  email: string;
}
export type LendingStatus = "borrowed" | "returned" | "overdue";

export interface BookLending {
  bookLendingId: string;
  bookItem: BookItem;
  member: Member;
  fines: number;
  creationDate: string;
  dueDate: string;
  returnDate?: string;
  status: LendingStatus;
}

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "librarian" | "member";
  accountStatus: "active" | "blocked";
  createdAt?: string;
}

interface ActionHistory {
  actionType: string;
  date: string;
  target?: string;
}

/* ====================== COMPONENT ====================== */
const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [borrowHistory, setBorrowHistory] = useState<BookLending[]>([]);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [loadingBorrow, setLoadingBorrow] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedBorrowHistory = Array.isArray(borrowHistory)
    ? borrowHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const paginatedActionHistory = Array.isArray(actionHistory)
    ? actionHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages =
    detail?.role === "member"
      ? Math.ceil((borrowHistory?.length || 0) / itemsPerPage)
      : Math.ceil((actionHistory?.length || 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Modal edit
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    role: "" as "admin" | "librarian" | "member" | "",
    email: "",
  });

  /* ===== Load user detail ===== */
  useEffect(() => {
    if (!id || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userDetail: UserDetail = res.data?.data ?? res.data;
        setDetail(userDetail);
      } catch (err) {
        console.error("Lỗi khi load user detail:", err);
      }
    };

    fetchUser();
  }, [id, token]);

  /* ===== Load borrow history nếu là member ===== */
  useEffect(() => {
    if (!id || !token || detail?.role !== "member") return;

    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
    if (!isValidObjectId) return;

    const fetchBorrowHistory = async () => {
      setLoadingBorrow(true);
      try {
        const res = await axios.get(`${API_BASE}/users/${id}/borrow-history`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { memberId: id },
        });

        const history = res.data?.data ?? res.data;
        setBorrowHistory(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error("Lỗi khi load borrow history:", err);
        setBorrowHistory([]);
      } finally {
        setLoadingBorrow(false);
      }
    };

    fetchBorrowHistory();
  }, [id, token, detail?.role]);

  /* ===== Load action history nếu là librarian ===== */
  useEffect(() => {
    if (!id || !token || detail?.role !== "librarian") return;

    const fetchActionHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${id}/borrow-history`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: id },
        });

        const actions = res.data?.data ?? res.data;
        setActionHistory(Array.isArray(actions) ? actions : []);
      } catch (err) {
        console.error("Lỗi khi load action history:", err);
        setActionHistory([]);
      }
    };

    fetchActionHistory();
  }, [id, token, detail?.role]);

  /* ===== Actions ===== */
  const toggleStatus = async () => {
    if (!id || !token) return;
    try {
      await axios.put(
        `${API_BASE}/users/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetail(res.data?.data ?? res.data);
    } catch (err) {
      console.error("Lỗi khi toggle status:", err);
    }
  };

  const deleteUser = async () => {
    if (!id || !token) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/management_member");
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  /* ===== Edit ===== */
  const startEdit = () => {
    if (!detail) return;
    setFormData({
      name: detail.name || "",
      phone: detail.phone || "",
      address: detail.address || "",
      role: detail.role,
      email: detail.email || "",
    });
    setEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !token) return;

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      alert("Số điện thoại phải có đúng 10 chữ số!");
      return;
    }

    try {
      await axios.put(`${API_BASE}/users/${detail._id}/byAdmin`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật thành công!");
      const res = await axios.get(`${API_BASE}/users/${detail._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetail(res.data?.data ?? res.data);
      setEditing(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
    }
  };

  if (!detail) return <p className="p-6">Đang tải...</p>;

  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-8 max-w-6xl mx-auto">
        {/* Nút Back */}
        <button
          onClick={() => navigate("/management_member")}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          ← Quay lại
        </button>

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Chi tiết người dùng
        </h1>

        {/* Thông tin user */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><b>Tên:</b> {detail.name}</p>
            <p><b>Email:</b> {detail.email}</p>
            <p><b>Số điện thoại:</b> {detail.phone || "-"}</p>
            <p><b>Địa chỉ:</b> {detail.address || "-"}</p>
            <p><b>Vai trò:</b> {detail.role}</p>
            <p><b>Trạng thái:</b> {detail.accountStatus}</p>
            <p><b>Ngày tạo:</b> {detail.createdAt ? new Date(detail.createdAt).toLocaleString() : "-"}</p>
          </div>

          {user?.role === "admin" && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <FiEdit2 /> Chỉnh sửa
              </button>
              <button
                onClick={toggleStatus}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                {detail.accountStatus === "active" ? <FiLock /> : <FiUnlock />}
                {detail.accountStatus === "active" ? "Khóa" : "Mở khóa"}
              </button>
              <button
                onClick={deleteUser}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <FiTrash2 /> Xóa
              </button>
            </div>
          )}
        </div>

        {/* Lịch sử mượn sách (Member) */}
        {detail.role === "member" && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Lịch sử mượn sách</h2>
            {loadingBorrow ? (
              <p>Đang tải...</p>
            ) : borrowHistory.length === 0 ? (
              <p className="text-gray-500">Không có phiếu mượn nào</p>
            ) : (
              <>
                <table className="w-full border border-gray-200 text-left rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Mã phiếu</th>
                      <th className="border px-4 py-2">Sách</th>
                      <th className="border px-4 py-2">Ngày mượn</th>
                      <th className="border px-4 py-2">Hạn trả</th>
                      <th className="border px-4 py-2">Ngày trả</th>
                      <th className="border px-4 py-2">Trạng thái</th>
                      <th className="border px-4 py-2">Tiền phạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBorrowHistory.map((item) => (
                      <tr key={item.bookLendingId} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{item.bookLendingId}</td>
                        <td className="border px-4 py-2">{item.bookItem?.title || "-"}</td>
                        <td className="border px-4 py-2">{new Date(item.creationDate).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td className="border px-4 py-2">{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : "-"}</td>
                        <td className="border px-4 py-2 capitalize">{item.status}</td>
                        <td className="border px-4 py-2">{item.fines || 0} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span>Trang {currentPage}/{totalPages}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Lịch sử thao tác (Librarian) */}
        {detail.role === "librarian" && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Lịch sử thao tác</h2>
            {actionHistory.length === 0 ? (
              <p className="text-gray-500">Không có dữ liệu</p>
            ) : (
              <>
                <ul className="list-disc pl-6 space-y-1">
                  {paginatedActionHistory.map((a, i) => (
                    <li key={i}>
                      {a.actionType} - {new Date(a.date).toLocaleString()}
                      {a.target ? ` (${a.target})` : ""}
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span>Trang {currentPage}/{totalPages}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h2>
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

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default UserDetailPage;
