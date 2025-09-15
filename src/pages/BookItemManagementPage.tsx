import { useEffect, useMemo, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { Virtuoso } from "react-virtuoso";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaSync } from "react-icons/fa";

import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api";



type ItemStatus = "available" | "loaned" | "reserved";

interface BookOption {
  _id: string;
  title: string;
  ISBN?: string;
}

interface RackOption {
  _id: string;
  code: string;
  location?: string;
}

interface BookRef {
  _id: string;
  title: string;
  isbn?: string;
}

interface RackRef {
  _id: string;
  code: string;
  location?: string;
}

interface BookItem {
  _id: string;
  barcode: string;
  book: BookRef;
  rack?: RackRef | null;
  isReferenceOnly: boolean;
  price?: number;
  status: ItemStatus;
  dateOfPurchase: string;
}

interface GetAllBookItemsResponse {
  success: boolean;
  data: {
    bookItems: BookItem[];
    total: number;
    page: number;
    limit: number;
  };
}

interface CreateUpdatePayload {
  bookId: string;
  isReferenceOnly?: boolean;
  price?: number;
  rackId?: string | null;
}

interface CreateUpdateResponse {
  success: boolean;
  data: {
    bookItemId: string;
    barcode: string;
    bookId: string;
    isReferenceOnly: boolean;
    price?: number;
    status: ItemStatus;
    dateOfPurchase: string;
    rackId?: string | null;
  };
}

interface UpdateStatusResponse {
  success: boolean;
  data: { bookItemId: string; barcode: string; status: ItemStatus };
}

interface DeleteResponse {
  success: boolean;
  data: { message: string };
}

interface GetByBarcodeResponse {
  success: boolean;
  data: BookItem;
}

export default function BookItemManagementPage() {
  const { token, user, loading: authLoading } = useAuth();

  const [items, setItems] = useState<BookItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page] = useState(1);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ItemStatus | "">("");

  const [showModal, setShowModal] = useState<null | "create" | "edit" | "view">(null);
  const [selected, setSelected] = useState<BookItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // dropdown data
  const [books, setBooks] = useState<BookOption[]>([]);
  const [bookQuery, setBookQuery] = useState("");
  const [racks, setRacks] = useState<RackOption[]>([]);

  // form create/edit
  const [form, setForm] = useState<{
    bookId: string;
    isReferenceOnly: boolean;
    price?: number;
    rackId?: string | null;
  }>({
    bookId: "",
    isReferenceOnly: false,
    price: undefined,
    rackId: undefined,
  });

  // load items
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get<GetAllBookItemsResponse>(`/book-items`, {
        params: { status: status || undefined, page, limit },
      });
      setItems(res.data.data.bookItems);
      setTotal(res.data.data.total);
    } catch (e) {
      console.error("Failed to load book items:", e);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, status]);

  // load books for dropdown (search-as-you-type)
  const loadBooks = useCallback(async (query: string) => {
    if (!token) return;
    try {
      const res = await api.get<BookOption[]>(`/books/search`, {
        params: { query: query || "" },
      });
      setBooks(res.data);
    } catch (e) {
      console.error("Failed to load books:", e);
    }
  }, [token]);

  // load racks for dropdown
  const loadRacks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get<{ success: boolean; data: { racks: RackOption[] } }>(`/racks`, {
        params: { limit: 1000 },
      });
      if (Array.isArray(res.data.data.racks)) setRacks(res.data.data.racks);
    } catch (e) {
      console.error("Failed to load racks:", e);
    }
  }, [token]);

  useEffect(() => {
    if (!token || authLoading) return;
    loadData();
  }, [token, authLoading, loadData]);

  useEffect(() => {
    if (showModal === "create" || showModal === "edit") {
      loadBooks(bookQuery);
      loadRacks();
    }
  }, [showModal, bookQuery, loadBooks, loadRacks]);

  // debounce book search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showModal === "create" || showModal === "edit") loadBooks(bookQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [bookQuery, showModal, loadBooks]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((it) => {
      const inBarcode = it.barcode.toLowerCase().includes(keyword);
      const inTitle = it.book?.title?.toLowerCase().includes(keyword);
      const inIsbn = (it.book?.isbn || "").toLowerCase().includes(keyword);
      const inRack = (it.rack?.code || "").toLowerCase().includes(keyword);
      return inBarcode || inTitle || inIsbn || inRack;
    });
  }, [q, items]);

  const openCreate = () => {
    setErrMsg(null);
    setForm({ bookId: "", isReferenceOnly: false, price: undefined, rackId: undefined });
    setBookQuery("");
    setShowModal("create");
  };

  const openEdit = (it: BookItem) => {
    setErrMsg(null);
    setSelected(it);
    setForm({
      bookId: it.book?._id,
      isReferenceOnly: !!it.isReferenceOnly,
      price: it.price,
      rackId: it.rack?._id ?? null,
    });
    setBookQuery(it.book?.title || "");
    setShowModal("edit");
  };

  const openView = (it: BookItem) => {
    setSelected(it);
    setShowModal("view");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa bản sao này?")) return;
    try {
      await api.delete<DeleteResponse>(`/book-items/${id}`);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Xóa thất bại");
    }
  };

  const handleSave = async () => {
    if (!form.bookId) {
      setErrMsg("Vui lòng chọn sách");
      return;
    }

    // Kiểm tra bookId hợp lệ
    if (!/^[0-9a-fA-F]{24}$/.test(form.bookId)) {
      setErrMsg("Book ID không hợp lệ");
      return;
    }

    setErrMsg(null);
    setSaving(true);
    try {
      const payload: CreateUpdatePayload = {
        bookId: form.bookId,
        isReferenceOnly: form.isReferenceOnly,
        price: form.price,
        rackId: form.rackId === "" ? undefined : form.rackId,
      };

      if (showModal === "create") {
        await api.post<CreateUpdateResponse>(`/book-items`, payload);
      } else if (showModal === "edit" && selected) {
        await api.put<CreateUpdateResponse>(`/book-items/${selected._id}`, payload);
      }
      setShowModal(null);
      setSelected(null);
      await loadData();
    } catch (e) {
      const ax = e as AxiosError<{ error?: string }>;
      setErrMsg(ax.response?.data?.error || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id: string, next: ItemStatus) => {
    try {
      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      console.log("Changing status", id, next);

      const res = await api.put<UpdateStatusResponse>(
        `/book-items/${id}/status`,
        { status: next }
      );

      console.log(res.data);
      await loadData();
    } catch (e) {
      const ax = e as AxiosError<{ error?: string }>;
      console.error(ax.response?.data, ax.response?.status);
      alert(ax.response?.data?.error || "Đổi trạng thái thất bại");
    }
  };

  const searchBarcode = async () => {
    const code = q.trim();
    if (!code) return loadData();
    try {
      setLoading(true);
      const res = await api.get<GetByBarcodeResponse>(`/book-items/${encodeURIComponent(code)}`);
      setItems([res.data.data]);
      setTotal(1);
    } catch {
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout user={user ? { name: user.username, role: user.role } : null} isLoading={authLoading}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý bản sao (Book Items)</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-gray-200 rounded flex items-center gap-2"
              onClick={() => loadData()}
              title="Tải lại"
            >
              <FaSync /> Làm mới
            </button>
            {(user?.role === "admin" || user?.role === "librarian") && (
              <button
                className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                onClick={openCreate}
              >
                <FaPlus /> Thêm bản sao
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {user?.role === "librarian" && (
            <input
              className="border rounded p-2 flex-1 min-w-[240px]"
              placeholder="Tìm barcode / tiêu đề / ISBN / mã kệ..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          )}
          {/* Filter trạng thái */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus | "")}

            className="border rounded p-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="available">available</option>
            <option value="loaned">loaned</option>
            <option value="reserved">reserved</option>
          </select>
          {user?.role === "librarian" && (
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
              onClick={searchBarcode}
            >
              <FaSearch /> Tìm
            </button>
          )}
        </div>

        {/* Header */}
        <div className="grid grid-cols-8 bg-gray-100 border-b font-semibold text-sm">
          <div className="p-2">Barcode</div>
          <div className="p-2">Tiêu đề</div>
          <div className="p-2">ISBN</div>
          <div className="p-2">Kệ</div>
          <div className="p-2">Giá</div>
          <div className="p-2">Ref-only</div>
          <div className="p-2">Trạng thái</div>
          <div className="p-2">Hành động</div>
        </div>

        {/* List */}
        {loading ? (
          <p>Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-gray-500">Không có bản sao nào</p>
        ) : (
          <Virtuoso
            style={{ height: 520 }}
            totalCount={filtered.length}
            itemContent={(index) => {
              const it = filtered[index];
              return (
                <div className="grid grid-cols-8 border-b items-center text-sm">
                  <div className="p-2">{it.barcode}</div>
                  <div className="p-2 truncate">{it.book?.title}</div>
                  <div className="p-2">{it.book?.isbn || "-"}</div>
                  <div className="p-2">{it.rack?.code || "-"}</div>
                  <div className="p-2">{typeof it.price === "number" ? it.price.toLocaleString() : "-"}</div>
                  <div className="p-2">{it.isReferenceOnly ? "Yes" : "No"}</div>
                  <div className="p-2">{it.status}</div>
                  <div className="p-2 flex gap-2">
                    <button className="p-1 bg-blue-500 text-white rounded" onClick={() => openView(it)}>
                      <FaEye />
                    </button>
                    {(user?.role === "admin" || user?.role === "librarian") && (
                      <>
                        <button className="p-1 bg-yellow-500 text-white rounded" onClick={() => openEdit(it)}>
                          <FaEdit />
                        </button>
                        <button className="p-1 bg-red-600 text-white rounded" onClick={() => handleDelete(it._id)}>
                          <FaTrash />
                        </button>
                        <select
                          className="border rounded p-1"
                          value={it.status}
                          onChange={(e) => changeStatus(it._id, e.target.value as ItemStatus)}
                          disabled={user?.role !== "librarian"}
                        >
                          <option value="available">available</option>
                          <option value="loaned">loaned</option>
                          <option value="reserved">reserved</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
              );
            }}
          />
        )}

        {/* Footer */}
        <div className="mt-3 text-sm text-gray-600">
          Tổng: {total.toLocaleString()} – Trang {page}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded shadow w-full max-w-xl p-6">
              {showModal === "view" && selected && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Chi tiết bản sao</h2>
                  <div className="space-y-2 text-sm">
                    <div><b>Barcode:</b> {selected.barcode}</div>
                    <div><b>Tiêu đề:</b> {selected.book?.title}</div>
                    <div><b>ISBN:</b> {selected.book?.isbn || "-"}</div>
                    <div><b>Kệ:</b> {selected.rack?.code || "-"}</div>
                    <div><b>Giá:</b> {typeof selected.price === "number" ? selected.price.toLocaleString() : "-"}</div>
                    <div><b>Reference only:</b> {selected.isReferenceOnly ? "Yes" : "No"}</div>
                    <div><b>Trạng thái:</b> {selected.status}</div>
                    <div><b>Ngày nhập:</b> {new Date(selected.dateOfPurchase).toLocaleString()}</div>
                  </div>
                  <div className="mt-4 text-right">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowModal(null)}>
                      Đóng
                    </button>
                  </div>
                </div>
              )}

              {(showModal === "create" || showModal === "edit") && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {showModal === "create" ? "Thêm bản sao" : "Cập nhật bản sao"}
                  </h2>
                  {errMsg && <div className="mb-3 text-red-600">{errMsg}</div>}

                  <div className="space-y-3">
                    {/* Chọn sách */}
                    <div>
                      <label className="block font-semibold mb-1">Chọn sách *</label>
                      <select
                        className="border rounded p-2 w-full"
                        value={form.bookId}
                        onChange={(e) => setForm((s) => ({ ...s, bookId: e.target.value }))}
                      >
                        <option value="">-- Chọn sách --</option>
                        {books.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.title} {b.ISBN ? `(${b.ISBN})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reference only */}
                    <div>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.isReferenceOnly}
                          onChange={(e) => setForm((s) => ({ ...s, isReferenceOnly: e.target.checked }))}
                        />
                        <span>Reference only</span>
                      </label>
                    </div>

                    {/* Giá */}
                    <div>
                      <label className="block font-semibold mb-1">Giá</label>
                      <input
                        type="number"
                        className="border rounded p-2 w-full"
                        placeholder="Ví dụ: 120000"
                        value={typeof form.price === "number" ? form.price : ""}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            price: e.target.value === "" ? undefined : Number(e.target.value),
                          }))
                        }
                      />
                    </div>

                    {/* Chọn kệ */}
                    <div>
                      <label className="block font-semibold mb-1">Chọn kệ</label>
                      <select
                        className="border rounded p-2 w-full"
                        value={form.rackId ?? ""}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            rackId: e.target.value === "" ? null : e.target.value,
                          }))
                        }
                      >
                        <option value="">-- Không chọn --</option>
                        {racks.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.code} {r.location ? `(${r.location})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                        onClick={() => setShowModal(null)}
                        disabled={saving}
                      >
                        Hủy
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Đang lưu..." : "Lưu"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}