import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/userApi";

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2 2 0 01-2.828 2.828l-1.514-1.514a4 4 0 00-1.01-4.434L4.93 4.93a10.075 10.075 0 015.07-1.932 10.007 10.007 0 012.23.355l-1.64 1.641a4 4 0 00-2.33 2.33z" clipRule="evenodd" /><path d="M10 12a2 2 0 110-4 2 2 0 010 4z" /></svg>;

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [visibility, setVisibility] = useState({});
  const navigate = useNavigate();

  const toggleVisibility = (field) => setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setIsError(false);
    if (formData.newPassword !== formData.confirmPassword) {
      setIsError(true); setMessage('New passwords do not match.');
      return;
    }
    try {
      await changePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      setMessage('Password changed successfully!');
      setTimeout(() => navigate('/Login'), 2000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input type={visibility.old ? 'text' : 'password'} name="oldPassword" placeholder="Old Password" value={formData.oldPassword} onChange={handleChange} className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="current-password" required />
            <button type="button" onClick={() => toggleVisibility('old')} className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">{visibility.old ? <EyeOffIcon /> : <EyeIcon />}</button>
          </div>
          <div className="relative">
            <input type={visibility.new ? 'text' : 'password'} name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="new-password" required />
            <button type="button" onClick={() => toggleVisibility('new')} className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">{visibility.new ? <EyeOffIcon /> : <EyeIcon />}</button>
          </div>
          <div className="relative">
            <input type={visibility.confirm ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="new-password" required />
            <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">{visibility.confirm ? <EyeOffIcon /> : <EyeIcon />}</button>
          </div>
          {message && (<p className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>)}
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;