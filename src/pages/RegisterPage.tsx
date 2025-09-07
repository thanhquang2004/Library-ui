import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: user?.role === "admin" ? "member" : "member",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return regex.test(email);
  };

  // Validate phone
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  // Check email exists by calling API
  const checkEmailExists = async (email: string) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/check-email`, { email });
      return res.data.exists; // backend trả về { exists: true/false }
    } catch {
      return false; // Nếu lỗi thì coi như không tồn tại
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    setError(null);
    setSuccess(null);

    // Validate username
    if (!data.username.trim()) {
      setError("Tên người dùng không được để trống.");
      return;
    }

    // Validate email
    if (!validateEmail(data.email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }

    // Check email tồn tại
    const exists = await checkEmailExists(data.email);
    if (exists) {
      setError("Email đã tồn tại. Vui lòng chọn email khác.");
      return;
    }

    // Validate password
    if (!data.password.trim()) {
      setError("Mật khẩu không được để trống.");
      return;
    }

    // Validate phone
    if (!validatePhone(data.phone)) {
      setError("Số điện thoại phải gồm đúng 10 chữ số.");
      return;
    }

    if (!token) {
      setError("Bạn cần đăng nhập để thực hiện chức năng này.");
      return;
    }

    if (user?.role !== "admin" && user?.role !== "librarian") {
      setError("Bạn không có quyền tạo tài khoản mới.");
      return;
    }

    const payload = {
      name: data.username,
      email: data.email,
      password: data.password,
      address: data.address,
      phone: data.phone,
      role: user?.role === "admin" ? data.role : "member",
    };

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201 && res.data.success) {
        setSuccess("Đăng ký thành công!");
              setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error || "Dữ liệu không hợp lệ");
        } else if (err.response.status === 409) {
          setError(err.response.data.error || "Email đã tồn tại");
        } else if (err.response.status === 401) {
          setError("Token không hợp lệ hoặc đã hết hạn.");
        } else {
          setError("Đã xảy ra lỗi, vui lòng thử lại");
        }
      } else {
        setError("Không thể kết nối đến server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#00ACE8] to-[#B2EBF2] flex items-center justify-end px-4">
      {/* Cột logo */}
      <div className="w-3/5 flex flex-col items-center justify-center p-8">
        <img
          src="/logo-login.png"
          alt="Library"
          className="max-w-md w-full mb-6 rounded-lg"
        />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-white text-[#00ACE8] font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          ← Trở về Trang Chủ
        </button>
      </div>

      {/* Cột form */}
      <div className="w-full md:w-2/5 max-w-lg bg-white rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto mr-36">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#00ACE8]">
          Đăng ký
        </h2>
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
          success={success}
          loading={loading}
          isAdmin={user?.role === "admin"}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
