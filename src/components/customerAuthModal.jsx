import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerRegisterApi } from '../api/customerAuthApi';
import toast from 'react-hot-toast';

const CustomerAuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, 'customer'); 
      toast.success('Logged in successfully!');
      onAuthSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await customerRegisterApi({ username: formData.username, email: formData.email, password: formData.password });
      toast.success('Account created! Please log in to continue.');
      setIsLoginView(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1A1A1A] text-white w-full max-w-sm rounded-2xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isLoginView ? 'Sign In to Purchase' : 'Create an Account'}</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button onClick={() => setIsLoginView(true)} className={`flex-1 py-2 font-semibold ${isLoginView ? 'text-white border-b-2 border-blue-500' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setIsLoginView(false)} className={`flex-1 py-2 font-semibold ${!isLoginView ? 'text-white border-b-2 border-blue-500' : 'text-gray-500'}`}>Register</button>
        </div>

        <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
          {!isLoginView && (
            <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button type="submit" className="w-full py-3 mt-4 bg-[#007CF0] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
            {isLoginView ? 'Sign In & Purchase' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerAuthModal;