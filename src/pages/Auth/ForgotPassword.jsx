import { useState } from "react";
import { forgotPasswordApi } from "../../api/authApi";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await forgotPasswordApi(email);
      setMessage(response.message || "If an account with that email exists, a reset link has been sent.");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-4 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-center text-sm text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p className={`text-sm text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>
         <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
      </div>
    </div>
  );
};

export default ForgotPassword;