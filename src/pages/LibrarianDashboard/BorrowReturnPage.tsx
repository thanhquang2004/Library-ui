import BorrowTable from "../../components/librarian/BorrowTable";

export default function BorrowReturnPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📖 Quản lý mượn / trả</h1>
      <BorrowTable />
    </div>
  );
}
