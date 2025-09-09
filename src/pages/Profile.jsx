import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../api/userApi';

const Profile = () => {
  // Get the new updateUserInContext function from the context
  const { user, updateUserInContext } = useAuth(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    setMessage('');
    setIsError(false);
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setIsError(true);
      setMessage('Please select a file first.');
      return;
    }

    try {
      const response = await uploadAvatar(selectedFile);
      setMessage('Profile picture updated successfully!');
      
      // Use the new context function to update the user data everywhere
      updateUserInContext(response.data.user);
      
      setSelectedFile(null);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Upload failed. Please try again.');
      console.error(error);
    }
  };

  const avatarSrc = user?.avatar_url 
    ? `http://localhost:5000${user.avatar_url}` 
    : `https://ui-avatars.com/api/?name=${user?.username}&background=0D8ABC&color=fff&size=128`;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={avatarSrc}
            alt="Profile Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <div className="w-full pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Profile Picture</label>
            <div className="flex items-center space-x-2">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button 
                onClick={handleUpload}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
            {message && <p className={`text-sm text-center mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;