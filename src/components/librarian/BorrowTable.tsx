export default function BorrowTable() {
    return (
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Độc giả</th>
            <th className="p-2 border">Sách</th>
            <th className="p-2 border">Ngày mượn</th>
            <th className="p-2 border">Ngày trả</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Nguyễn Văn A</td>
            <td className="border p-2">Lập trình React</td>
            <td className="border p-2">10/08/2025</td>
            <td className="border p-2">20/08/2025</td>
          </tr>
        </tbody>
      </table>
    );
  }
  