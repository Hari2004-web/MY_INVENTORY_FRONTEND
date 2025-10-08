import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar, updateProfile } from '../api/userApi';
import toast from 'react-hot-toast';

// --- Icons (can be moved to a separate file if you prefer) ---
const EditIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>;
const SaveIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;

const Profile = () => {
  const { user, updateUserInContext } = useAuth(); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  useEffect(() => {
    setUsername(user?.username || '');
  }, [user?.username]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }
    const loadingToast = toast.loading('Uploading picture...');
    try {
      const response = await uploadAvatar(selectedFile);
      toast.success('Profile picture updated!', { id: loadingToast });
      updateUserInContext(response.data.user);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed.', { id: loadingToast });
      console.error(error);
    }
  };

  const handleSaveUsername = async () => {
    if (username.trim() === '' || username.trim() === user.username) {
        setIsEditingUsername(false);
        setUsername(user.username);
        return;
    }
    const loadingToast = toast.loading('Updating username...');
    try {
        const response = await updateProfile({ username: username.trim() });
        updateUserInContext(response.data.user);
        toast.success("Username updated!", { id: loadingToast });
        setIsEditingUsername(false);
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update username.", { id: loadingToast });
        setUsername(user.username);
    }
  };

  const avatarSrc = user?.avatar_url 
    ? `http://localhost:5000${user.avatar_url}` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username)}&background=2563eb&color=fff&size=128`;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 to-gray-800 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 md:p-8 max-w-lg w-full">
        <div className="flex flex-col items-center space-y-6">
          
          <h1 className="text-3xl font-bold text-white mb-4">Your Profile</h1>

          <div className="relative">
            <img 
              src={avatarSrc}
              alt="Profile Avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-lg"
            />
          </div>
          
          <div className="text-center">
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-2xl font-semibold text-center text-white bg-transparent border-b-2 border-slate-400 focus:outline-none focus:border-white transition-colors"
                  autoComplete="username"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                />
                <button onClick={handleSaveUsername} className="text-green-400 hover:text-green-300 p-1">
                  <SaveIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingUsername(true)}>
                <h2 className="text-2xl font-semibold text-white">{user?.username}</h2>
                <button className="text-slate-400 group-hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditIcon />
                </button>
              </div>
            )}
            <p className="text-slate-300 mt-1">{user?.email}</p>
          </div>

          <div className="w-full pt-6 border-t border-white/20">
            <label className="block text-sm font-medium text-slate-300 mb-2">Update Profile Picture</label>
            <div className="flex items-center space-x-4">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-slate-200 hover:file:bg-white/20 transition-colors cursor-pointer"
              />
              <button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-500/50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;