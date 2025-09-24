import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar, updateProfile } from '../api/userApi';

const EditIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const SaveIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;

const Profile = () => {
  const { user, updateUserInContext } = useAuth(); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  useEffect(() => {
    setUsername(user?.username || '');
  }, [user?.username]);

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
      setIsError(false);
      updateUserInContext(response.data.user);
      setSelectedFile(null);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Upload failed.');
      console.error(error);
    }
  };

  const handleSaveUsername = async () => {
    if (username.trim() === '' || username.trim() === user.username) {
        setIsEditingUsername(false);
        setUsername(user.username);
        return;
    }
    try {
        const response = await updateProfile({ username: username.trim() });
        updateUserInContext(response.data.user);
        setMessage("Username updated successfully!");
        setIsError(false);
        setIsEditingUsername(false);
    } catch (error) {
        setMessage(error.response?.data?.message || "Failed to update username.");
        setIsError(true);
        setUsername(user.username);
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
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-xl font-semibold text-center border-b-2 border-blue-500 focus:outline-none"
                  autoComplete="username"
                  autoFocus
                />
                <button onClick={handleSaveUsername} className="text-green-500 hover:text-green-700 p-1">
                  <SaveIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <button onClick={() => setIsEditingUsername(true)} className="text-gray-400 group-hover:text-blue-600 p-1">
                  <EditIcon />
                </button>
              </div>
            )}
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
                disabled={!selectedFile}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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