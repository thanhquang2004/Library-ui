import React, { useEffect, useState, useCallback } from "react";
import {
  FaExchangeAlt,
  FaSearch,
  FaUser,
  FaPlus,
  FaClock,
  FaList,
} from "react-icons/fa";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar"; // 👈 import SidebarLayout


interface Lending {
  _id: string;
  member: { _id: string; name: string; email: string };
  book: { _id: string; title: string };
  status: "borrowing" | "returned" | "overdue";
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

const BorrowReturnPage: React.FC = () => {
    const {  user, loading: authLoading } = useAuth();

  const [lendings, setLendings] = useState<Lending[]>([]);
  const [loading, setLoading, ] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [memberId, setMemberId] = useState("");
  const [selected, setSelected] = useState<Lending | null>(null);

  // 📌 fetch danh sách phiếu mượn
  const fetchLendings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/book-lendings", {
        params: {
          status: filterStatus !== "all" ? filterStatus : undefined,
          memberId: memberId || undefined,
        },
      });
      setLendings(res.data);
    } catch (err) {
      console.error("Error fetching lendings:", err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, memberId]);

  useEffect(() => {
    fetchLendings();
  }, [fetchLendings]);

  // ➕ Tạo phiếu mượn
  const createLending = async () => {
    try {
      const member = prompt("Nhập ID độc giả:");
      const book = prompt("Nhập ID sách:");
      if (!member || !book) return;
      await api.post("/book-lendings", { member, book });
      alert("Tạo phiếu mượn thành công!");
      fetchLendings();
    } catch (err) {
      console.error("Error creating lending:", err);
    }
  };

  // 🔄 Gia hạn
  const extendLending = async (id: string) => {
    try {
      await api.put(`/book-lendings/${id}/extend`);
      alert("Gia hạn thành công!");
      fetchLendings();
    } catch (err) {
      console.error("Error extending lending:", err);
    }
  };

  // ⏰ Kiểm tra quá hạn
  const checkOverdue = () => {
    const overdue = lendings.filter((l) => l.status === "overdue");
    alert(`Có ${overdue.length} phiếu mượn quá hạn`);
  };

  return (
    <SidebarLayout user={user ? { name: user.username, role: user.role } : null}
    isLoading={authLoading}>
      <div className="p-8 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaExchangeAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý mượn trả</h1>
            <p className="text-gray-600">
              Tạo phiếu mượn, gia hạn, kiểm tra quá hạn và quản lý danh sách
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={createLending}
            disabled={!user || (user.role !== "librarian" && user.role !== "admin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
              user && (user.role === "librarian" || user.role === "admin")
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPlus /> Tạo phiếu mượn
          </button>

          <button
            onClick={checkOverdue}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-red-600 text-white hover:bg-red-700"
          >
            <FaClock /> Kiểm tra quá hạn
          </button>

          <button
            onClick={fetchLendings}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow bg-green-600 text-white hover:bg-green-700"
          >
            <FaList /> Làm mới danh sách
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="borrowing">Đang mượn</option>
              <option value="returned">Đã trả</option>
              <option value="overdue">Quá hạn</option>
            </select>

            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Lọc theo ID độc giả..."
              className="px-3 py-2 border rounded-lg flex-1"
            />
          </div>
        </div>

        {/* Lending List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Độc giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày mượn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hạn trả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : lendings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có phiếu mượn
                  </td>
                </tr>
              ) : (
                lendings.map((l) => (
                  <tr
                    key={l._id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelected(l)}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {l.member?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {l.member?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{l.book?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(l.borrowDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(l.dueDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          l.status === "borrowing"
                            ? "bg-yellow-100 text-yellow-800"
                            : l.status === "returned"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {l.status === "borrowing"
                          ? "Đang mượn"
                          : l.status === "returned"
                          ? "Đã trả"
                          : "Quá hạn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {l.status === "borrowing" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            extendLending(l._id);
                          }}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Gia hạn
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lending Detail */}
        {selected && (
          <div className="mt-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaSearch /> Chi tiết phiếu mượn
            </h3>
            <p>
              <strong>Độc giả:</strong> {selected.member?.name} (
              {selected.member?.email})
            </p>
            <p>
              <strong>Sách:</strong> {selected.book?.title}
            </p>
            <p>
              <strong>Ngày mượn:</strong>{" "}
              {new Date(selected.borrowDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Hạn trả:</strong>{" "}
              {new Date(selected.dueDate).toLocaleDateString("vi-VN")}
            </p>
            {selected.returnDate && (
              <p>
                <strong>Ngày trả:</strong>{" "}
                {new Date(selected.returnDate).toLocaleDateString("vi-VN")}
              </p>
            )}
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selected.status === "borrowing"
                ? "Đang mượn"
                : selected.status === "returned"
                ? "Đã trả"
                : "Quá hạn"}
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default BorrowReturnPage;
