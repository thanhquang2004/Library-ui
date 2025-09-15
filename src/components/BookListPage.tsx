import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
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
  format: "hardcover" | "paperback" | "ebook";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [query, setQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState<"create" | "edit" | "view" | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null); // Thêm state để hiển thị lỗi khi tải dữ liệu

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString("vi-VN");
  };
  // Load authors và books
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoadingBooks(true);
    setLoadError(null);
    try {
      // Lấy danh sách tác giả
      const authorRes = await axios.get<Author[]>(`${API_BASE}/author/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthors(authorRes.data);

      const authorsMap = new Map<string, string>();
      authorRes.data.forEach(a => authorsMap.set(a.authorId, a.name));

      // Lấy danh sách sách
      const bookRes = await axios.get<BookApi[]>(`${API_BASE}/books/search`, {
        params: query ? { query } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map authorIds -> authorNames
      const enrichedBooks: Book[] = bookRes.data.map((b) => {
        // Lấy danh sách ID tác giả
        const authorIds: string[] = b.authors.map(a => {
          if (typeof a === "string") return a;
          return (a as { _id: string; name?: string })._id;
        });

        // Lấy danh sách tên tác giả dựa trên authorsMap đã tạo ở trên
        const authorNames: string[] = authorIds.map(id => authorsMap.get(id) || "(Không rõ tên)");

        return {
          ...b,
          bookId: b._id,
          authors: authorIds, // dùng cho Select
          authorNames,       // dùng để hiển thị
        };
      });

      setBooks(enrichedBooks);
    } catch (err) {
      console.error("Error loading data:", err);
      setLoadError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoadingBooks(false);
    }
  }, [token, query]);

  useEffect(() => {
    if (!token || authLoading) return;
    loadData();
  }, [token, authLoading, loadData]);


  const handleSubmit = async () => {
    // Rút gọn logic kiểm tra validation
    const requiredFields = ['title', 'isbn', 'publisher', 'bookLanguage', 'publicationDate', 'numberOfPages', 'format'];
    const hasMissingField = requiredFields.some(field => !formData[field as keyof Partial<Book>]);
    const hasMissingAuthors = !formData.authors || formData.authors.length === 0;

    if (hasMissingField || hasMissingAuthors) {
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
        bookLanguage: formData.bookLanguage,
        numberOfPages: formData.numberOfPages,
        format: formData.format,
        digitalUrl: formData.digitalUrl,
        coverImage: formData.coverImage,
        authors: formData.authors,
      };

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
    <SidebarLayout
      user={user ? { name: user.username, role: user.role } : null}
      isLoading={authLoading}
    >
      <div className="p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý sách</h1>
        </header>

        {loadError && <p className="text-red-500">{loadError}</p>}

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">

          {loadingBooks ? (
            <p className="p-4 text-gray-500">Đang tải...</p>
          ) : books.length === 0 ? (
            <p className="p-4 text-gray-500">Không có sách nào</p>
          ) : (
            <Virtuoso
              style={{ height: 500 }}
              totalCount={books.length}
              itemContent={(index) => {
                const b = books[index];
                return (
                  <div
                    key={b.bookId}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition mb-4"
                  >
                    {/* Ảnh bìa */}
                    <div className="w-full md:w-32 flex-shrink-0">
                      {b.coverImage ? (
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-full h-48 object-cover rounded"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Thông tin sách */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-lg font-bold">{b.title}</h3>
                      <p><strong>ISBN:</strong> {b.isbn}</p>
                      <p><strong>NXB:</strong> {b.publisher || "N/A"}</p>
                      <p><strong>Ngôn ngữ:</strong> {b.bookLanguage === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</p>
                      <p><strong>Thể loại:</strong> {b.categories?.join(", ") || "N/A"}</p>
                      <p><strong>Tác giả:</strong> {b.authorNames.join(", ") || "N/A"}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        onClick={() => {
                          setSelectedBook(b);
                          setShowModal("view");
                        }}
                      >
                        Xem
                      </button>
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        onClick={() => {
                          setFormData({
                            ...b,
                            categories: b.categories || [],
                            authors: b.authors || [],
                          });
                          setSelectedBook(b);
                          setShowModal("edit");
                        }}
                      >
                        Sửa
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          )}

        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
            <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
              {/* View */}
              {showModal === "view" && selectedBook && (
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                  {selectedBook.coverImage && (
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="w-40 h-60 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  <p><strong>NXB:</strong> {selectedBook.publisher}</p>
                  <p><strong>Ngôn ngữ:</strong> {selectedBook.bookLanguage === "vi" ? "Tiếng Việt" : "Tiếng Anh"}</p>
                  <p><strong>Ngày xuất bản:</strong> {formatDate(selectedBook.publicationDate)}</p>
                  <p><strong>Số trang:</strong> {selectedBook.numberOfPages}</p>
                  <p><strong>Định dạng:</strong> {selectedBook.format}</p>
                  <p><strong>Thể loại:</strong> {selectedBook.categories?.join(", ")}</p>
                  <p><strong>Tác giả:</strong> {selectedBook.authorNames.join(", ")}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setShowModal(null)}
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* Create / Edit */}
              {(showModal === "create" || showModal === "edit") && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {showModal === "create" ? "Thêm sách" : "Cập nhật sách"}
                  </h2>
                  {errorMsg && <p className="text-red-500">{errorMsg}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold">Tiêu đề</label>
                      <input
                        type="text"
                        placeholder="Nhập tiêu đề"
                        className="border rounded p-2 w-full"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">ISBN</label>
                      <input
                        type="text"
                        placeholder="Nhập ISBN"
                        className="border rounded p-2 w-full"
                        value={formData.isbn || ""}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">NXB</label>
                      <input
                        type="text"
                        placeholder="Nhập nhà xuất bản"
                        className="border rounded p-2 w-full"
                        value={formData.publisher || ""}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">Ngôn ngữ</label>
                      <select
                        className="border rounded p-2 w-full"
                        value={formData.bookLanguage || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bookLanguage: e.target.value as "vi" | "en" })
                        }
                      >
                        <option value="">-- Chọn ngôn ngữ --</option>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">Tiếng Anh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold">Ngày xuất bản</label>
                      <input
                        type="date"
                        className="border rounded p-2 w-full"
                        value={formData.publicationDate || ""}
                        onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">Số trang</label>
                      <input
                        type="number"
                        placeholder="Nhập số trang"
                        className="border rounded p-2 w-full"
                        value={formData.numberOfPages || ""}
                        onChange={(e) => setFormData({ ...formData, numberOfPages: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">Định dạng</label>
                      <select
                        className="border rounded p-2 w-full"
                        value={formData.format || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, format: e.target.value as BookApi["format"] })
                        }
                      >
                        <option value="">-- Chọn định dạng --</option>
                        <option value="hardcover">Hardcover</option>
                        <option value="paperback">Paperback</option>
                        <option value="ebook">Ebook</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold">Tác giả</label>
                      <Select
                        isMulti
                        options={authors.map((a) => ({ value: a.authorId, label: a.name }))}
                        value={formData.authors
                          ?.map((id) => {
                            const author = authors.find((a) => a.authorId === id);
                            return author ? { value: author.authorId, label: author.name } : null;
                          })
                          .filter(Boolean)}
                        onChange={(selected) => {
                          const ids = selected
                            .filter((s): s is { value: string; label: string } => !!s)
                            .map((s) => s.value);
                          setFormData({ ...formData, authors: ids });
                        }}
                        placeholder="Chọn tác giả..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold">URL ảnh bìa</label>
                      <input
                        type="text"
                        placeholder="Nhập URL ảnh bìa"
                        className="border rounded p-2 w-full"
                        value={formData.coverImage || ""}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      onClick={() => setShowModal(null)}
                    >
                      Hủy
                    </button>
                    <button
                      className={`px-4 py-2 text-white rounded ${loadingSubmit ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      onClick={handleSubmit}
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? "Đang lưu..." : "Lưu"}
                    </button>
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