import BookForm from "../../components/librarian/BookForm";

export default function BooksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📚 Quản lý tài liệu</h1>
      <BookForm />
      {/* sau này thêm bảng hiển thị danh sách sách */}
    </div>
  );
}
