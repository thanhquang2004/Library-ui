import React, { useEffect, useState, useCallback } from "react";
import SidebarLayout from "../components/Sidebar";
import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

// ----------------- Interfaces -----------------
interface Fine {
  fineId: string;
  member: {
    _id: string;
    email: string;
    role: string;
  };
  amount: number;
  reason: string;
  status: "unpaid" | "paid";
}

interface Overdue {
  lendingId: string;
  bookTitle: string;
  dueDate: string;
  memberId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Lending {
  lendingId: string;
  bookItem: { book: string };
  member: string;
  dueDate: string;
  status: "borrowed" | "returned" | "overdue";
}

// ----------------- Component -----------------
const FineManagementPage: React.FC = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [overdueList, setOverdueList] = useState<Overdue[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [unpaidTotals, setUnpaidTotals] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Overdue | null>(null);
  const [amount, setAmount] = useState<number>(50000);
  const [reason, setReason] = useState<string>("Quá hạn trả sách");
  interface Book {
    _id: string;
    book: string;
    title: string;
    // add other properties if needed
  }
  const [books, setBooks] = useState<Book[]>([]);

  const { user, token } = useAuth();

  // helper log
  const logError = (label: string, error: unknown) => {
    if (error instanceof AxiosError) {
      console.error(`${label}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error(`${label}:`, error);
    }
  };

  // ----------------- Fetch APIs -----------------
  const fetchFines = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1️⃣ fetch fines
      const { data: finesData } = await api.get<Fine[]>("/fines/search", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Fines fetched:", finesData);
      setFines(finesData);

      // 2️⃣ fetch books
      const { data: booksData } = await api.get(`/books/search`, {
        params: { query: "" },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Books fetched:", booksData);
      setBooks(booksData);

      // 3️⃣ fetch unpaid totals
      const totals: Record<string, number> = {};
      for (const f of finesData) {
        if (!f.member) continue; // skip nếu member null

        if (!totals[f.member._id]) {
          const res = await api.get<{ total: number }>(
            `/fines/user/${f.member._id}/unpaid-total`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          totals[f.member._id] = res.data.total;
        }
      }
      setUnpaidTotals(totals);

    } catch (error: unknown) {
      logError("❌ Error fetching fines", error);
      setErrorMsg("Không thể tải danh sách khoản phạt. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [token]);


  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/users", {
        params: { page: 1, limit: 9999 },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Users fetched:", data.data.users);
      setAllUsers(data.data.users || []);
    } catch (error: unknown) {
      logError("❌ Error fetching users", error);
    }
  }, [token]);

  const fetchOverdueList = useCallback(async () => {
    try {
      const { data } = await api.get<Lending[]>("/book-lendings", {
        params: { status: "borrowed" },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Book lendings fetched:", data);

      const now = new Date();
      const overdueData: Overdue[] = data
        .filter((l) => new Date(l.dueDate) < now && l.status === "borrowed")
        .map((l) => ({
          lendingId: l.lendingId,
          bookTitle: l.bookItem?.book || "Unknown",
          dueDate: l.dueDate,
          memberId: l.member,
        }));

      console.log("⚠️ Overdue list:", overdueData);
      setOverdueList(overdueData);
    } catch (error: unknown) {
      logError("❌ Error fetching overdue list", error);
    }
  }, [token]);

  useEffect(() => {
    fetchFines();
    fetchUsers();
    fetchOverdueList();
  }, [fetchFines, fetchUsers, fetchOverdueList]);

  // ----------------- Helpers -----------------
  const displayMember = useCallback(
    (memberId: string | null, memberData?: { _id: string; name?: string; email: string }) => {
      if (!memberId) return "Unknown";

      // Nếu đã có memberData trực tiếp từ fine/overdue, ưu tiên dùng
      if (memberData) return memberData.name || memberData.email || "Unknown";

      // Fallback: tìm trong allUsers nếu là mảng
      if (!Array.isArray(allUsers)) return "Unknown";

      const found = allUsers.find((u) => u._id === memberId);
      return found?.name || found?.email || "Unknown";
    },
    [allUsers]
  );

  const getBookTitle = (bookId: string) => {
    console.log("bookid: ", bookId)
    return books.find(b => b._id === bookId)?.title || "Unknown";
  };


  // ----------------- Fine Actions -----------------
  const handleMarkAsPaid = async (fineId: string) => {
    try {
      await api.put(`/fines/${fineId}/paid`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFines();
    } catch (error: unknown) {
      logError("❌ Error marking fine as paid", error);
    }
  };


  const handleSoftDelete = async (fineId: string) => {
    try {
      await api.delete(`/fines/${fineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFines();
    } catch (error: unknown) {
      logError("❌ Error soft deleting fine", error);
    }
  };

  const handleHardDelete = async (fineId: string) => {
    try {
      await api.delete(`/fines/hardDelete/${fineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFines();
    } catch (error: unknown) {
      logError("❌ Error hard deleting fine", error);
    }
  };

  // ----------------- Create Fine -----------------
  const openModal = (overdue: Overdue) => {
    setModalData(overdue);
    setAmount(50000);
    setReason("Quá hạn trả sách");
    setShowModal(true);
  };
  const handleCreateFine = async () => {
    if (!modalData) return;
    try {
      const payload = {
        memberId: modalData.memberId,          // backend dùng 'member'
        bookLendingId: modalData.lendingId,    // backend dùng 'bookLending'
        amount: Number(amount),               // đảm bảo là number
        reason,
      };

      console.log("Creating fine:", payload);

      await api.post("/fines", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      fetchFines();
      alert("Tạo khoản phạt thành công!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Error creating fine:", error.response?.data || error.message);
      alert("Không thể tạo khoản phạt");
    }
  };

  // ----------------- Render -----------------
  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Quản lý tiền phạt
        </h1>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        {/* Overdue Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Sách quá hạn</h2>
          {overdueList.length === 0 ? (
            <p className="text-gray-500">Không có sách quá hạn</p>
          ) : (
            <ul className="bg-white shadow rounded divide-y">
              {overdueList.map((o) => (
                <li
                  key={o.lendingId}
                  className="flex justify-between items-center p-3"
                >
                  <div>
                    <p className="font-medium">{getBookTitle(o.bookTitle)}</p>
                    <p className="text-sm text-gray-600">
                      Người mượn: {displayMember(o.memberId)}
                    </p>
                    <p className="text-sm text-red-600">
                      Hạn trả: {new Date(o.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(o)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    <FaPlus className="mr-1" /> Tạo phiếu phạt
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>


        {/* Fines Table */}
        <h2 className="text-xl font-semibold mb-2">Danh sách khoản phạt</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : fines.length === 0 ? (
          <p className="text-gray-500">Chưa có khoản phạt nào</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Người dùng</th>
                  <th className="p-2 text-left">Số tiền</th>
                  <th className="p-2 text-left">Lý do</th>
                  <th className="p-2 text-left">Trạng thái</th>
                  <th className="p-2 text-left">Tổng nợ</th>
                  <th className="p-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.fineId} className="border-t">
                    {/* Người dùng */}
                    <td className="p-2">
                      {displayMember(fine.member?._id, fine.member)}
                    </td>

                    {/* Số tiền */}
                    <td className="p-2">
                      {fine.amount?.toLocaleString() || 0} VND
                    </td>

                    {/* Lý do */}
                    <td className="p-2">{fine.reason || "-"}</td>

                    {/* Trạng thái */}
                    <td className="p-2">
                      {fine.status === "paid" ? (
                        <span className="text-green-600 font-semibold">Đã trả</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Chưa trả</span>
                      )}
                    </td>

                    {/* Tổng nợ */}
                    <td className="p-2">
                      {unpaidTotals[fine.member?._id]?.toLocaleString() || 0} VND
                    </td>

                    {/* Hành động */}
                    <td className="p-2 flex space-x-2">
                      {fine.status === "unpaid" && (
                        <button
                          onClick={() => handleMarkAsPaid(fine.fineId)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleSoftDelete(fine.fineId)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleHardDelete(fine.fineId)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Xóa hẳn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* Modal */}
        {/* Modal */}
        {showModal && modalData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-semibold mb-4">Tạo phiếu phạt</h2>

              <p className="mb-2">
                <strong>Sách:</strong> {getBookTitle(modalData.bookTitle)}
              </p>

              <p className="mb-2">
                <strong>Người mượn:</strong> {displayMember(modalData.memberId)}
              </p>

              <label className="block mb-2">
                Số tiền:
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="border p-2 rounded w-full"
                />
              </label>

              <label className="block mb-4">
                Lý do:
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAmount(50000);  // reset amount
                    setReason("Quá hạn trả sách"); // reset reason
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateFine}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
};

export default FineManagementPage;
