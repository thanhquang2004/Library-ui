import { useEffect, useState } from "react";
import SidebarLayout from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api";


interface Lending {
  bookLendingId: string;
  bookItem: { book: string };
  member: string; // userId của member
  lendingDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
}

interface BookOption {
  _id: string;
  title: string;
  ISBN?: string;
}

const LoanHistoryPage: React.FC = () => {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<Lending[]>([]);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookOption[]>([]);

  useEffect(() => {
    if (!token || !user) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [lendingsRes, booksRes] = await Promise.all([
          api.get<Lending[]>("/book-lendings", { headers: { Authorization: `Bearer ${token}` } }),
          api.get<BookOption[]>(`/books/search`, {
            params: { query: "" }
          }),
        ]);

        setHistory(lendingsRes.data.filter((l) => l.member === user.id));
        setBooks(booksRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token, user]);

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b._id === bookId);
    return book?.title || "Unknown";
  };



  return (
    <SidebarLayout
      user={user ? { name: user.username, role: user.role || "unknown" } : null}
      isLoading={false}
    >
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">📚 Lịch sử mượn sách</h1>

        {loading ? (
          <p>Đang tải...</p>
        ) : history.length === 0 ? (
          <p>Chưa có lịch sử mượn sách.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Tên sách</th>
                <th className="p-2 border">Ngày mượn</th>
                <th className="p-2 border">Ngày đến hạn</th>
                <th className="p-2 border">Ngày trả</th>
                <th className="p-2 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.bookLendingId} className="border-t">
                  <td className="p-2 border">{getBookTitle(h.bookItem.book)}</td>
                  <td className="p-2 border">{new Date(h.lendingDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{new Date(h.dueDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{h.returnDate ? new Date(h.returnDate).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">
                    {h.status === "borrowed" && "Đang mượn"}
                    {h.status === "returned" && "Đã trả"}
                    {h.status === "overdue" && "Quá hạn"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SidebarLayout>
  );
};

export default LoanHistoryPage;
