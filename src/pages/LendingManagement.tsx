import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Virtuoso } from "react-virtuoso";
import { FaPlus, FaSearch, FaSync } from "react-icons/fa";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api";

type LendingStatus = "borrowed" | "returned" | "overdue";

interface BookItemRef {
  _id: string;
  barcode: string;
  title?: string;
  isbn?: string;
  price: number;
}

interface UserRef {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
}

interface Lending {
  lendingId: string;
  bookItem: BookItemRef | null;
  member: UserRef | string;
  lendingDate?: string;
  dueDate: string;
  returnDate?: string | null;
  status: LendingStatus;
  fines?: number | null;
  creationDate?: string;
}

export default function LendingManagementPage() {
  const { token, user, loading: authLoading } = useAuth();

  const [lendings, setLendings] = useState<Lending[]>([]);
  const [allUsers, setAllUsers] = useState<UserRef[]>([]);
  const [availableItems, setAvailableItems] = useState<BookItemRef[]>([]);

  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<LendingStatus | "">("");

  const [showModal, setShowModal] = useState<null | "create" | "extend">(null);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [form, setForm] = useState<{ bookItemId: string; memberId: string; dueDate: string }>({
    bookItemId: "",
    memberId: "",
    dueDate: "",
  });

  const [extendForm, setExtendForm] = useState<{ lendingId: string; newDueDate: string }>({
    lendingId: "",
    newDueDate: "",
  });

  const statusMap: Record<string, string> = {
  borrowed: "Đã được mượn",
  returned: "Sẵn sàng ",
  overdue: "Quá hạn",
};



  /** ================== LOAD DATA ================== */
  const loadLendings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get<Lending[]>(`/book-lendings`, { params: { status: statusFilter || undefined } });
      console.log(res.data);
      setLendings(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load lendings:", e);
      setLendings([]);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  const loadAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/users`, { params: { page: 1, limit: 1000 } });
      const responseData = res.data?.data;
      setAllUsers(responseData?.users || []);
    } catch (e) {
      console.error("Failed to load users:", e);
      setAllUsers([]);
    }
  }, [token]);

  const loadAvailableItems = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/book-items`, { params: { status: "available", limit: 1000 } });
      console.log("Available items:", res.data);
      setAvailableItems(res.data.data.bookItems || []);
    } catch (e) {
      console.error("Failed to load available items:", e);
      setAvailableItems([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token || authLoading) return;
    loadLendings();
    loadAllUsers();
  }, [token, authLoading, loadLendings, loadAllUsers]);

  useEffect(() => {
    if (showModal === "create") loadAvailableItems();
  }, [showModal, loadAvailableItems]);

  /** ================== HELPERS ================== */
  const displayMember = useCallback(
    (m: UserRef | string) => {
      if (typeof m === "string") {
        const found = allUsers.find((u) => u._id === m);
        return found?.name || found?.email || m;
      }
      return m?.name || m?.email || m?._id || "Unknown";
    },
    [allUsers]
  );

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return lendings.filter((l) => {
      const memberName = displayMember(l.member).toLowerCase();
      const book = `${l.bookItem?.barcode || ""} ${l.bookItem?.title || ""}`.toLowerCase();
      return (memberName.includes(kw) || book.includes(kw)) && (statusFilter ? l.status === statusFilter : true);
    });
  }, [q, lendings, statusFilter, displayMember]);

  /** ================== ACTIONS ================== */
  const handleCreate = async () => {
    if (!form.bookItemId || !form.memberId || !form.dueDate) {
      setErrMsg("Vui lòng nhập đủ thông tin");
      return;
    }
    setErrMsg(null);
    setSaving(true);
    try {
      await api.post(`/book-lendings`, form);
      setShowModal(null);
      await loadLendings();
    } catch (e) {
      const ax = e as AxiosError<{ error?: string }>;
      setErrMsg(ax.response?.data?.error || "Tạo phiếu mượn thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async (lendingId: string) => {
    if (!lendingId) return alert("ID phiếu mượn không hợp lệ");
    if (!window.confirm("Xác nhận trả sách?")) return;
    try {
      await api.put(`/book-lendings/${lendingId}/return`);
      await loadLendings();
    } catch (e) {
      console.error("Return failed:", e);
      alert("Trả sách thất bại");
    }
  };

  const handleExtendSubmit = async () => {
    if (!extendForm.lendingId || !extendForm.newDueDate) return alert("ID hoặc ngày hạn mới không hợp lệ");
    try {
      await api.put(`/book-lendings/${extendForm.lendingId}/extend`, { newDueDate: extendForm.newDueDate });
      setShowModal(null);
      await loadLendings();
    } catch (e) {
      console.error("Extend failed:", e);
      alert("Gia hạn thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return alert("ID phiếu mượn không hợp lệ");
    if (!window.confirm("Xóa phiếu này?")) return;
    try {
      await api.delete(`/book-lendings/${id}`);
      await loadLendings();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Xóa thất bại");
    }
  };

  /** ================== RENDER ================== */
  return (
    <SidebarLayout user={user ? { name: user.username, role: user.role } : null} isLoading={authLoading}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Quản lý mượn - trả sách</h1>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-gray-200 rounded flex items-center gap-2" onClick={loadLendings}>
              <FaSync /> Làm mới
            </button>
            {user?.role === "librarian" && (
              <button
                className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                onClick={() => {
                  setForm({ bookItemId: "", memberId: "", dueDate: "" });
                  setShowModal("create");
                }}
              >
                <FaPlus /> Tạo phiếu mượn
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded p-2 flex-1"
            placeholder="Tìm theo thành viên hoặc barcode..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LendingStatus | "")}
            className="border rounded p-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="borrowed">Đã cho mượn</option>
            <option value="returned">Đã được trả</option>
            <option value="overdue">Quá hạn</option>
          </select>
          <button className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2" onClick={loadLendings}>
            <FaSearch /> Lọc
          </button>
        </div>

        {/* Table */}
        <div className="grid grid-cols-8 bg-gray-100 border-b font-semibold text-sm">
          <div className="p-2">Thành viên</div>
          <div className="p-2">Barcode / Tiêu đề</div>
          <div className="p-2">Ngày mượn</div>
          <div className="p-2">Hạn trả</div>
          <div className="p-2">Trạng thái</div>
          <div className="p-2">Tiền phạt</div>
          <div className="p-2">Hành động</div>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-gray-500">Không có dữ liệu</p>
        ) : (
          <Virtuoso
            style={{ height: 500 }}
            data={filtered}
            itemContent={(_, l) => (
              <div
                key={l.lendingId}
                className={`grid grid-cols-8 border-b items-center text-sm ${l.status === "overdue" ? "bg-red-100" : ""}`}
              >
                <div className="p-2">{displayMember(l.member)}</div>
                <div className="p-2">{l.bookItem ? `${l.bookItem.barcode} - ${l.bookItem.title || ""}` : "-"}</div>
                <div className="p-2">{l.returnDate ? new Date(l.returnDate).toLocaleString() : "-"}</div>
                <div className="p-2">{l.dueDate ? new Date(l.dueDate).toLocaleString() : "-"}</div>
                <div className="p-2">{statusMap[l.status] || l.status}</div>
                <div className="p-2">
                  {l.bookItem?.price
                    ? new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(l.bookItem.price) + " VND"
                    : "-"}
                </div>
                <div className="p-2 flex gap-2">
                  {l.status === "borrowed" && (
                    <>
                      {user?.role === "librarian" && (
                        <>
                          <button
                            className="bg-yellow-400 px-2 py-1 rounded text-white"
                            onClick={() => handleReturn(l.lendingId)}
                          >
                            Trả
                          </button>
                          <button
                            className="bg-blue-400 px-2 py-1 rounded text-white"
                            onClick={() => {
                              setExtendForm({ lendingId: l.lendingId, newDueDate: l.dueDate });
                              setShowModal("extend");
                            }}
                          >
                            Gia hạn
                          </button>
                        </>
                      )}
                    </>
                  )}{user?.role === "admin" && (
                    <button
                    className="bg-red-500 px-2 py-1 rounded text-white"
                    onClick={() => handleDelete(l.lendingId)}
                  >
                    Xóa
                  </button>
                  )
                }
                </div>
              </div>
            )}
          />
        )}

        {/* Modal Tạo phiếu mượn */}
        {showModal === "create" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="text-lg font-bold mb-4">Tạo phiếu mượn</h2>
              {errMsg && <p className="text-red-500 mb-2">{errMsg}</p>}
              <div className="flex flex-col gap-2 mb-4">
                <select
                  className="border p-2 rounded"
                  value={form.memberId}
                  onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                >
                  <option value="">Chọn thành viên</option>
                  {allUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded"
                  value={form.bookItemId}
                  onChange={(e) => setForm({ ...form, bookItemId: e.target.value })}
                >
                  <option value="">Chọn sách</option>
                  {availableItems.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.barcode} - {b.title}
                    </option>
                  ))}
                </select>
                <label className="text-sm text-gray-600">Ngày trả (bắt buộc)</label>
                <input
                  type="datetime-local"
                  className="border p-2 rounded"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-2 bg-gray-300 rounded" onClick={() => setShowModal(null)}>
                  Hủy
                </button>
                <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={handleCreate} disabled={saving}>
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gia hạn */}
        {showModal === "extend" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="text-lg font-bold mb-4">Gia hạn phiếu mượn</h2>
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="datetime-local"
                  className="border p-2 rounded"
                  value={extendForm.newDueDate}
                  onChange={(e) => setExtendForm({ ...extendForm, newDueDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-2 bg-gray-300 rounded" onClick={() => setShowModal(null)}>
                  Hủy
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={handleExtendSubmit}>
                  Gia hạn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
