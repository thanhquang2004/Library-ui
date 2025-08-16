export default function DashboardHeader() {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">📌 Thủ thư Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Xin chào, Thủ thư</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded">Đăng xuất</button>
        </div>
      </header>
    );
  }
  