import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: typeof formData) => {
    // try {
    //   const response = await fetch("/api/users/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
    //   const result = await response.json();
    //   if (!response.ok) throw new Error(result.error || "Registration failed");
    //   alert("Registration successful!");
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "An error occurred");
    // }
    setError (null); // Reset error state
    console.log("Dữ liệu form gửi lên:", data);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#00ACE8] to-[#B2EBF2] flex items-center justify-end px-4">
        <div className="w-3/5 flex flex-col items-center justify-center p-8">
    <img
      src="/src/img/logo-login.png"
      alt="Library"
      className="max-w-md w-full mb-6 rounded-lg "
    />
  </div>
  <div className="w-full md:w-2/5 max-w-lg bg-white rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto mr-36">
    <h2 className="text-3xl font-bold text-center mb-6 text-[#00ACE8]">Sign Up</h2>
    <RegisterForm
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
    />
  </div>
</div>

  );
};

export default RegisterPage;