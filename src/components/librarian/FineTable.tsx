export default function FineTable() {
    return (
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Độc giả</th>
            <th className="p-2 border">Lý do</th>
            <th className="p-2 border">Số tiền</th>
            <th className="p-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Nguyễn Văn B</td>
            <td className="border p-2">Trả sách trễ</td>
            <td className="border p-2">20,000 VND</td>
            <td className="border p-2">Chưa thanh toán</td>
          </tr>
        </tbody>
      </table>
    );
  }
  