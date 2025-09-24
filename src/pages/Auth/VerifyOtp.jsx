import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../../api/authApi"; // You will create this API function

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      await verifyOtpApi({ email, otp });
      navigate(`/reset-password?email=${email}&otp=${otp}`);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-4 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
        <p className="text-center text-sm text-gray-600">Enter the OTP sent to your email.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {message && <p className={`text-sm text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;