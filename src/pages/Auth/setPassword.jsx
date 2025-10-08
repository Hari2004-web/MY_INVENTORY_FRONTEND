// src/pages/Auth/SetPassword.jsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setPasswordApi } from "../../api/authApi";

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await setPasswordApi(token, password);
      setMessage(response.message);
      setIsError(false);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after success
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "An error occurred. The link may be invalid or expired.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-4 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Set Your Account Password</h2>
        <p className="text-center text-sm text-gray-600">Welcome! Create a secure password to activate your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Enter New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg" 
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg" 
            required 
          />
          {message && (
            <p className={`text-sm text-center font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            Set Password & Activate
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;