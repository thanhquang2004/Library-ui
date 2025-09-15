import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/Sidebar";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Lending {
  bookLendingId: string;
  bookItem: { title: string };
  member: string; // userId của member
  creationDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
}

const LoanHistoryPage: React.FC = () => {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<Lending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || !user) return;

      setLoading(true);
      try {
        // 1. Lấy tất cả phiếu mượn
        const { data } = await api.get<Lending[]>("/book-lendings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 2. Lọc ra phiếu của user hiện tại
        const userHistory = data.filter((l) => l.member === user.id);

        setHistory(userHistory);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ Error fetching loan history:", err.message);
        } else {
          console.error("❌ Error fetching loan history:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, user]);

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
                  <td className="p-2 border">{h.bookItem?.title || "Unknown"}</td>
                  <td className="p-2 border">
                    {new Date(h.creationDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {new Date(h.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {h.returnDate ? new Date(h.returnDate).toLocaleDateString() : "-"}
                  </td>
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
