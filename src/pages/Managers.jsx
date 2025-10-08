// src/pages/Managers.jsx

import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { sendMessage } from "../api/messageApi";
import Modal from "../components/modals";
import Button from "../components/Button"; // This import was missing
import toast from 'react-hot-toast';

// --- Icon Components for a better UI ---
const EditIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const MessageIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', role: 'manager' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messagingManager, setMessagingManager] = useState(null);
  const [messageData, setMessageData] = useState({ subject: '', body: '' });

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
    setCurrentUser(user ? { ...user } : { username: '', email: '', role: 'manager' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? 'Updating user...' : 'Sending invitation...');
    
    try {
      if (isEditing) {
        await updateUser(currentUser.id, { username: currentUser.username, email: currentUser.email, role: currentUser.role });
        toast.success("User updated successfully!", { id: loadingToast });
      } else {
        await createUser(currentUser);
        toast.success("Manager created and invitation sent!", { id: loadingToast });
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      // This is the crucial part: It catches the error from the server (like 409 Conflict)
      // and displays the specific error message in a user-friendly toast.
      toast.error(error.response?.data?.message || "An unexpected error occurred.", { id: loadingToast });
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
    setIsMessageModalOpen(true);
  };
  const handleCloseMessageModal = () => setIsMessageModalOpen(false);
  const handleMessageChange = (e) => setMessageData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Sending message...');
    try {
      const payload = { recipient_id: messagingManager.id, subject: messageData.subject, body: messageData.body };
      await sendMessage(payload);
      toast.success("Message sent successfully!", { id: loadingToast });
      handleCloseMessageModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send message.", { id: loadingToast });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
        <Button onClick={() => handleOpenModal()}>
          + Add New User
        </Button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Username</th>
                <th className="p-4 font-semibold text-slate-600">Email</th>
                <th className="p-4 font-semibold text-slate-600">Role</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{manager.username}</td>
                  <td className="p-4 text-slate-600">{manager.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      manager.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {manager.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                        <button onClick={() => handleOpenMessageModal(manager)} className="text-slate-500 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><MessageIcon /></button>
                        <button onClick={() => handleOpenModal(manager)} className="text-slate-500 hover:text-yellow-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><EditIcon /></button>
                        <button onClick={() => handleDelete(manager.id)} className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><DeleteIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit User" : "Invite New User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Username" value={currentUser.username} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <input type="email" name="email" placeholder="Email" value={currentUser.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select id="role" name="role" value={currentUser.role} onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" required>
              <option value="manager">Manager</option>
              <option value="billing_manager">Billing Manager</option>
            </select>
          </div>

          <Button type="submit" variant="success" className="w-full">
            {isEditing ? "Save Changes" : "Send Invitation"}
          </Button>
        </form>
      </Modal>

      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={`Send Message to ${messagingManager?.username}`}>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <input type="text" name="subject" placeholder="Subject" value={messageData.subject} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          <textarea name="body" rows="4" placeholder="Your message..." value={messageData.body} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Managers;