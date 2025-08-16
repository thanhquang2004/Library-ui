export default function ReaderTable() {
    return (
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tên độc giả</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Nguyễn Văn A</td>
            <td className="border p-2">vana@example.com</td>
            <td className="border p-2">Hoạt động</td>
          </tr>
        </tbody>
      </table>
    );
  }
  