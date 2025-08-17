import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_URL;

export default function BookListPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); // Lấy token sau khi login

    const res = await axios.get<Book[]>(`${API_BASE}/books/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBooks(res.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(err);
      setError(err.response?.data?.error || "Không thể tải dữ liệu sách");
    } else {
      console.error(err);
      setError("Đã xảy ra lỗi không xác định");
    }
  } finally {
    setLoading(false);
  }
};

    fetchBooks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={null} isLoading={false} />
      <div className="p-6 space-y-6 flex-1">
        {/* Thanh tìm kiếm + lọc */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-lg border ${
                viewMode === "grid" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Lưới
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg border ${
                viewMode === "list" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Danh sách
            </button>
          </div>
        </div>

        {/* Danh sách kết quả */}
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {books.map((book, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow flex flex-col"
              >
                <img
                  src={book.coverImage || "https://via.placeholder.com/150x200"}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-3 font-semibold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-500">
                  {book.authors?.join(", ")}
                </p>
                <p className="text-xs text-gray-400">
                  Xuất bản: {book.publicationDate}
                </p>
                <p className="text-xs text-gray-400">
                  Ngôn ngữ: {book.language}
                </p>
                <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
                  {book.categories?.join(", ")}
                </span>
                {book.digitalUrl && (
                  <a
                    href={book.digitalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm text-blue-500 hover:underline"
                  >
                    Đọc online
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Book {
  bookId: string;
  title: string;
  categories: string[];
  ISBN: string;
  phublisher: string;
  publicationDate: string;
  language: string;
  numberOfPages: number;
  format: string;
  authors: string[];
  digitalUrl: string;
  coverImage: string;
}
