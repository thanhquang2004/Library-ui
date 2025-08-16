import { useState } from "react";

export default function BookForm() {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thêm tài liệu: " + title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tên sách"
        className="border p-2 rounded w-full"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Thêm sách</button>
    </form>
  );
}
