import { useState } from "react";
import { registerApi } from "../../api/authApi";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      const res = await registerApi(formData);
      setMessage("✅ Admin registered successfully!");
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      setIsError(true);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Admin Registration</h2>
        {/* Inputs for username, email, password remain the same... */}
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Register Admin
        </button>
        {message && (
          <p className={`mt-3 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        )}
      </form>
    </div>
  );
}