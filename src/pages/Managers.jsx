// src/pages/Managers.jsx

import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { sendMessage } from "../api/messageApi";
import Modal from "../components/modals";
import toast from 'react-hot-toast';
import Button from "../components/Button";


const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 1. Add 'password' to the initial state for creating a new user
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: 'manager' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messagingManager, setMessagingManager] = useState(null);
  const [messageData, setMessageData] = useState({ subject: '', body: '' });
  const [messageStatus, setMessageStatus] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setManagers(response.data.filter(user => user.role === 'manager' || user.role === 'billing_manager'));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Could not fetch user data.");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenModal = (user = null) => {
    setIsEditing(!!user);
    // 2. Adjust state for adding a new user, ensuring password is included
    setCurrentUser(user ? { ...user } : { username: '', email: '', password: '', role: 'manager' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // No changes to the update logic needed
        await updateUser(currentUser.id, { username: currentUser.username, email: currentUser.email, role: currentUser.role });
        toast.success("User updated successfully!");
      } else {
        // 3. The 'createUser' API will now send the full user object including the password
        await createUser(currentUser);
        toast.success("Manager created successfully!");
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message || "This email is already in use.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Form submission error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action is irreversible.")) {
       try {
            await deleteUser(id);
            toast.success("User deleted successfully.");
            fetchUsers();
       } catch {
            toast.error("Failed to delete user.");
       }
    }
  };
  
  const handleOpenMessageModal = (manager) => {
    setMessagingManager(manager);
    setMessageData({ subject: '', body: '' });
    setMessageStatus('');
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => setIsMessageModalOpen(false);
  const handleMessageChange = (e) => setMessageData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMessageStatus('Sending...');
    try {
      const payload = { recipient_id: messagingManager.id, subject: messageData.subject, body: messageData.body };
      await sendMessage(payload);
      setMessageStatus("Message sent successfully!");
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
          
          {/* 4. Add the password input field, only shown when creating a new user */}
          {!isEditing && (
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={currentUser.password} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-lg" 
              required 
              autoComplete="new-password"
            />
          )}
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select id="role" name="role" value={currentUser.role} onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" required>
              <option value="manager">Manager</option>
              <option value="billing_manager">Billing Manager</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
            {/* 5. Change the button text */}
            {isEditing ? "Save Changes" : "Create User"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={`Send Message to ${messagingManager?.username}`}>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <input type="text" name="subject" placeholder="Subject" value={messageData.subject} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          <textarea name="body" rows="4" placeholder="Your message..." value={messageData.body} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          {messageStatus && <p className="text-sm text-center">{messageStatus}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Managers;