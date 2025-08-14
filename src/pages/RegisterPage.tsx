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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    // Email hợp lệ theo chuẩn RFC cơ bản
    const regex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    // Ít nhất 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt, tối thiểu 8 ký tự
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (data: typeof formData) => {
    setError(null);

    // Validate email
    if (!validateEmail(data.email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }

    // Validate password
    if (!validatePassword(data.password)) {
      setError(
        "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&), tối thiểu 8 ký tự."
      );
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201 && res.data.success) {
        alert("Đăng ký thành công!");
        navigate("/");
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
          src="/src/img/logo-login.png"
          alt="Library"
          className="max-w-md w-full mb-6 rounded-lg"
        />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-white text-[#00ACE8] font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          ← Back to Home
        </button>
      </div>

      {/* Cột form */}
      <div className="w-full md:w-2/5 max-w-lg bg-white rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto mr-36">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#00ACE8]">
          Sign Up
        </h2>
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          isAdmin={user?.role === "admin"}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
