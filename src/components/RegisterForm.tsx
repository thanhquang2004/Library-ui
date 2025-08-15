import React, { useState } from "react";

interface RegisterFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (data: RegisterFormProps["formData"]) => void;
  error: string | null;
  loading?: boolean;
  isAdmin?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  onChange,
  onSubmit,
  error,
  loading = false,
  isAdmin = false,
}) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("Số điện thoại phải gồm đúng 10 chữ số.");
      return;
    }
    setPhoneError(null);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
      <div>
        <input
          autoComplete="new-username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <input
          autoComplete="new-email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <input
          autoComplete="new-password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <input
          autoComplete="new-phone"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={onChange}
          required
        />
        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
      </div>

      <div>
        <input
          autoComplete="new-address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={onChange}
        />
      </div>

      {isAdmin && (
        <div>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="member">Member</option>
            <option value="librarian">Librarian</option>
          </select>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-[#00ACE8] hover:bg-blue-600"
          } text-white font-semibold py-3 rounded-lg transition duration-200`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
