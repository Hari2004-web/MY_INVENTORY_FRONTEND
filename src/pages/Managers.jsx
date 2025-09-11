import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser, sendMessage } from "../api/userApi";
import Modal from "../components/modals";

// Icons remain the same...
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2 2 0 01-2.828 2.828l-1.514-1.514a4 4 0 00-1.01-4.434L4.93 4.93a10.075 10.075 0 015.07-1.932 10.007 10.007 0 012.23.355l-1.64 1.641a4 4 0 00-2.33 2.33z" clipRule="evenodd" /><path d="M10 12a2 2 0 110-4 2 2 0 010 4z" /></svg>;


const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // **MODIFICATION**: Set default role to 'manager' for new users.
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: 'manager' });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messagingManager, setMessagingManager] = useState(null);
  const [messageData, setMessageData] = useState({ subject: '', message: '' });
  const [messageStatus, setMessageStatus] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      // **MODIFICATION**: Filter for both manager and billing_manager roles to display them on the page.
      setManagers(response.data.filter(user => user.role === 'manager' || user.role === 'billing_manager'));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenModal = (user = null) => {
    setIsEditing(!!user);
    // **MODIFICATION**: When editing, use the user's current role. When adding, default to 'manager'.
    setCurrentUser(user ? { ...user, password: '' } : { username: '', email: '', password: '', role: 'manager' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateUser(currentUser.id, { username: currentUser.username, email: currentUser.email, role: currentUser.role });
    } else {
      await createUser(currentUser);
    }
    fetchUsers();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleOpenMessageModal = (manager) => {
    setMessagingManager(manager);
    setMessageData({ subject: '', message: '' });
    setMessageStatus('');
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => setIsMessageModalOpen(false);
  const handleMessageChange = (e) => setMessageData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMessageStatus('Sending...');
    try {
      const payload = { email: messagingManager.email, subject: messageData.subject, message: messageData.message };
      const response = await sendMessage(payload);
      setMessageStatus(response.message || "Message sent successfully!");
      setTimeout(() => handleCloseMessageModal(), 2000);
    } catch (error) {
      setMessageStatus(error.response?.data?.error || "Failed to send.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Manage Users</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add User
        </button>
      </div>

      <ul className="space-y-2">
        {managers.map((m) => (
          <li key={m.id} className="bg-white shadow p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{m.username}</p>
              <p className="text-sm text-gray-500">{m.email}</p>
              {/* **MODIFICATION**: Display the user's role clearly. */}
              <p className="text-xs font-bold uppercase text-blue-600 mt-1">{m.role.replace('_', ' ')}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleOpenMessageModal(m)} className="text-sm bg-green-500 text-white px-3 py-1 rounded">Message</button>
              <button onClick={() => handleOpenModal(m)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Username" value={currentUser.username} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="email" name="email" placeholder="Email" value={currentUser.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          
          {/* === THE KEY CHANGE IS HERE === */}
          {/* This dropdown allows the admin to select the user's role. */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={currentUser.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              required
            >
              <option value="manager">Manager</option>
              <option value="billing_manager">Billing Manager</option>
            </select>
          </div>
          {/* ============================== */}

          {!isEditing && (
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={currentUser.password} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          )}

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
            {isEditing ? "Save Changes" : "Create User"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={`Send Message to ${messagingManager?.username}`}>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <input type="text" name="subject" placeholder="Subject" value={messageData.subject} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          <textarea name="message" rows="4" placeholder="Your message..." value={messageData.message} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required></textarea>
          {messageStatus && <p className="text-sm text-center">{messageStatus}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Send Email
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Managers;