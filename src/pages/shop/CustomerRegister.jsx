import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { customerRegisterApi } from "../../api/customerAuthApi";
import toast from 'react-hot-toast';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await customerRegisterApi(formData);
      toast.success('Account created! Please log in to continue.');
      navigate("/customer/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#1A1A1A] rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white">Create Account</h1>
        <p className="text-center text-slate-300">Join NEXUS to experience the future</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 mt-4 bg-[#007CF0] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
            Create Account
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/customer/login" className="font-medium text-blue-500 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;