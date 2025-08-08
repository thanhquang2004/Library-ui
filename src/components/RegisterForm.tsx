import React from "react";

interface RegisterFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (data: RegisterFormProps["formData"]) => void;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ formData, onChange, onSubmit, error }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <input
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
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="text"
      name="phone"
      placeholder="Phone"
      value={formData.phone}
      onChange={onChange}
    />
  </div>

  <div>
    <input
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="text"
      name="address"
      placeholder="Address"
      value={formData.address}
      onChange={onChange}
    />
  </div>

  {error && <p className="text-red-500 text-sm">{error}</p>}

  <div>
    <button
      type="submit"
      className="w-full bg-[#00ACE8] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
    >
      Register
    </button>
  </div>
</form>

  );
};

export default RegisterForm;
