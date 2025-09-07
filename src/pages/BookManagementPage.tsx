import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Virtuoso } from "react-virtuoso";
import Select from "react-select";

const API_BASE = import.meta.env.VITE_API_BASE;

interface BookApi {
  _id: string;
  title: string;
  isbn: string;
  categories: string[];
  publisher: string;
  publicationDate: string;
  bookLanguage: "vi" | "en";
  numberOfPages: number;
  format: "hardcover" | "paperback" | "ebook" ;
  authors: string[];
  digitalUrl?: string;
  coverImage?: string;
}

interface Book extends Omit<BookApi, "_id"> {
  bookId: string;
  authorNames: string[];
}

interface Author {
  authorId: string;
  name: string;
  description?: string;
  nationality?: string;
}

export default function BookManagementPage() {
  const { token, user, loading: authLoading } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [query, setQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState<"create" | "edit" | "view" | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("vi-VN");
  };

  // Load authors và books
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoadingBooks(true);
    try {
      // Lấy danh sách tác giả
      const authorRes = await axios.get<Author[]>(`${API_BASE}/author/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const authorMap = new Map<string, string>();
      authorRes.data.forEach(a => authorMap.set(a.authorId, a.name));
      setAuthors(authorRes.data);

      // Lấy danh sách sách
      const bookRes = await axios.get<BookApi[]>(`${API_BASE}/books/search`, {
        params: query ? { query } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map authorIds -> authorNames
      const enrichedBooks: Book[] = bookRes.data.map((b) => {
  const authorIds: string[] = b.authors.map(a => {
    if (typeof a === "string") return a;          // trường hợp chỉ là id string
    return (a as { _id: string; name?: string })._id; // trường hợp object {_id, name?}
  });

  const authorNames: string[] = b.authors.map(a => {
    if (typeof a === "string") return "(Chưa có tên)"; // nếu chỉ id không có name
    return (a as { _id: string; name?: string }).name || "(Chưa có tên)";
  });

  return {
    ...b,
    bookId: b._id,
    authors: authorIds,  // dùng cho Select
    authorNames,         // dùng để hiển thị
  };
});


      setBooks(enrichedBooks);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoadingBooks(false);
    }
  }, [token, query]);

  useEffect(() => {
    if (!token || authLoading) return;
    loadData();
  }, [token, authLoading, loadData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;
    try {
      await axios.delete(`${API_BASE}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadData();
    } catch (err) {
      console.error("Error deleting book", err);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.isbn ||
      !formData.publisher ||
      !formData.bookLanguage ||
      !formData.publicationDate ||
      !formData.numberOfPages ||
      !formData.format ||
      !formData.authors?.length
    ) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    setErrorMsg(null);
    setLoadingSubmit(true);

    try {
      const payload: Partial<BookApi> = {
        title: formData.title,
        isbn: formData.isbn,
        categories: formData.categories?.map(c => c.trim()).filter(Boolean),
        publisher: formData.publisher,
        publicationDate: formData.publicationDate,
        bookLanguage: formData.bookLanguage as "vi" | "en",
        numberOfPages: formData.numberOfPages,
        format: formData.format as "hardcover" | "paperback" | "ebook" ,
        digitalUrl: formData.digitalUrl,
        coverImage: formData.coverImage,
        authors: formData.authors as string[],
      };
      console.log("Payload gửi lên API:", payload);

      if (showModal === "create") {
        await axios.post(`${API_BASE}/books`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else if (showModal === "edit" && selectedBook) {
        await axios.put(`${API_BASE}/books/${selectedBook.bookId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setShowModal(null);
      setFormData({});
      loadData();
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      if (axiosErr.response?.data?.error) setErrorMsg(`Server: ${axiosErr.response.data.error}`);
      else setErrorMsg("Lỗi khi lưu sách");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <SidebarLayout user={user ? { name: user.username, role: user.role } : null} isLoading={authLoading}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý sách</h1>

        {/* Search + Add */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên, ISBN, thể loại..."
            className="border rounded p-2 flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="p-2 bg-blue-500 text-white rounded" onClick={loadData}><FaSearch /></button>
          {(user?.role === "admin" || user?.role === "librarian") && (
            <button className="flex items-center gap-2 p-2 bg-green-500 text-white rounded"
              onClick={() => { setShowModal("create"); setFormData({}); }}>
              <FaPlus /> Thêm sách
            </button>
          )}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-8 bg-gray-100 border-b font-semibold">
          <div className="p-2">Ảnh</div>
          <div className="p-2">Tiêu đề</div>
          <div className="p-2">ISBN</div>
          <div className="p-2">Thể loại</div>
          <div className="p-2">NXB</div>
          <div className="p-2">Ngôn ngữ</div>
          <div className="p-2">Tác giả</div>
          <div className="p-2">Hành động</div>
        </div>

        {/* List */}
        {loadingBooks ? <p>Đang tải...</p> :
          books.length === 0 ? <p className="text-gray-500 mt-4">Không có sách nào</p> :
            <Virtuoso
              style={{ height: 500 }}
              totalCount={books.length}
              itemContent={(index) => {
                const b = books[index];
                return (
                  <div className="grid grid-cols-8 border-b items-center text-sm">
                    <div className="p-2">
                      {b.coverImage ? <img src={b.coverImage} alt={b.title} className="w-12 h-16 object-cover rounded" loading="lazy"
                        onError={(e) => { e.currentTarget.src = "/placeholder.png"; }} /> :
                        <span className="text-gray-400">No image</span>}
                    </div>
                    <div className="p-2">{b.title}</div>
                    <div className="p-2">{b.isbn}</div>
                    <div className="p-2">{b.categories?.join(", ")}</div>
                    <div className="p-2">{b.publisher}</div>
                    <div className="p-2">{b.bookLanguage === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</div>
                    <div className="p-2">{b.authorNames.join(", ")}</div>
                    <div className="p-2 flex gap-2">
                      <button className="p-1 bg-blue-500 text-white rounded" onClick={() => { setSelectedBook(b); setShowModal("view"); }}><FaEye /></button>
                      {(user?.role === "admin" || user?.role === "librarian") && <>
                        <button className="p-1 bg-yellow-500 text-white rounded" onClick={() => { 
                          setSelectedBook(b); 
                          setFormData({
                            ...b,
                            authors: b.authors, // giữ ID
                            categories: b.categories || [],
                          }); 
                          setShowModal("edit"); 
                        }}><FaEdit /></button>
                        <button className="p-1 bg-red-500 text-white rounded" onClick={() => handleDelete(b.bookId)}><FaTrash /></button>
                      </>}
                    </div>
                  </div>
                );
              }}
            />
        }

        {/* Modal */}
        {showModal && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg overflow-auto max-h-[90vh]">

            {/* View */}
            {showModal === "view" && selectedBook && <div>
              <h2 className="text-xl font-bold mb-4">{selectedBook.title}</h2>
              {selectedBook.coverImage && <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-32 h-48 object-cover mb-4 rounded" loading="lazy" />}
              <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong>NXB:</strong> {selectedBook.publisher}</p>
              <p><strong>Ngôn ngữ:</strong> {selectedBook.bookLanguage === "vi" ? "vi" : "en"}</p>
              <p><strong>Ngày xuất bản:</strong> {formatDate(selectedBook.publicationDate)}</p>
              <p><strong>Số trang:</strong> {selectedBook.numberOfPages}</p>
              <p><strong>Định dạng:</strong> {selectedBook.format}</p>
              <p><strong>Thể loại:</strong> {selectedBook.categories?.join(", ")}</p>
              <p><strong>Tác giả:</strong> {selectedBook.authorNames.join(", ")}</p>
              <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowModal(null)}>Đóng</button>
            </div>}

            {/* Create / Edit */}
            {(showModal === "create" || showModal === "edit") && <div>
              <h2 className="text-xl font-bold mb-4">{showModal === "create" ? "Thêm sách" : "Cập nhật sách"}</h2>
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
              <div className="space-y-3">

                <label className="block font-semibold">Tiêu đề</label>
                <input type="text" placeholder="Nhập tiêu đề" className="border rounded p-2 w-full" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

                <label className="block font-semibold">ISBN</label>
                <input type="text" placeholder="Nhập ISBN" className="border rounded p-2 w-full" value={formData.isbn || ""} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />

                <label className="block font-semibold">Thể loại</label>
                <input type="text" placeholder="Ngăn cách bằng dấu ','" className="border rounded p-2 w-full" value={formData.categories?.join(", ") || ""} onChange={(e) => setFormData({ ...formData, categories: e.target.value.split(",").map(c => c.trim()).filter(Boolean) })} />

                <label className="block font-semibold">NXB</label>
                <input type="text" placeholder="Nhập nhà xuất bản" className="border rounded p-2 w-full" value={formData.publisher || ""} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} />

                <label className="block font-semibold">Ngôn ngữ</label>
                <select className="border rounded p-2 w-full" value={formData.bookLanguage || ""} onChange={(e) => setFormData({ ...formData, bookLanguage: e.target.value as "vi" | "en" })}>
                  <option value="">-- Chọn ngôn ngữ --</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">Tiếng Anh</option>
                </select>

                <label className="block font-semibold">Ngày xuất bản</label>
                <input type="date" className="border rounded p-2 w-full" value={formData.publicationDate || ""} onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })} />

                <label className="block font-semibold">Số trang</label>
                <input type="number" placeholder="Nhập số trang" className="border rounded p-2 w-full" value={formData.numberOfPages || ""} onChange={(e) => setFormData({ ...formData, numberOfPages: Number(e.target.value) })} />

                <label className="block font-semibold">Định dạng</label>
                <select className="border rounded p-2 w-full" value={formData.format || ""} onChange={(e) => setFormData({ ...formData, format: e.target.value as BookApi["format"] })}>
                  <option value="">-- Chọn định dạng --</option>
                  <option value="hardcover">Hardcover</option>
                  <option value="paperback">Paperback</option>
                  <option value="ebook">Ebook</option>
                  
                </select>

                <label className="block font-semibold">Tác giả</label>
                <Select
                  isMulti
                  options={authors.map(a => ({ value: a.authorId, label: a.name }))}
                  value={formData.authors?.map(id => {
                    const author = authors.find(a => a.authorId === id);
                    return author ? { value: author.authorId, label: author.name } : null;
                  }).filter(Boolean)}
                  onChange={(selected) => {
                    const ids = selected.filter((s): s is { value: string; label: string } => !!s).map(s => s.value);
                    setFormData({ ...formData, authors: ids });
                  }}
                  placeholder="Chọn tác giả..."
                />

                <label className="block font-semibold">URL ảnh bìa</label>
                <input type="text" placeholder="Nhập URL ảnh bìa" className="border rounded p-2 w-full" value={formData.coverImage || ""} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setShowModal(null)}>Hủy</button>
                <button className={`px-4 py-2 text-white rounded ${loadingSubmit ? "bg-gray-400" : "bg-blue-500"}`} onClick={handleSubmit} disabled={loadingSubmit}>
                  {loadingSubmit ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>}
          </div>
        </div>}
      </div>
    </SidebarLayout>
  );
}
