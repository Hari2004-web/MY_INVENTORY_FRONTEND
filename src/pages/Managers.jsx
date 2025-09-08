import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { sendMessage } from "../api/messageApi";
import Modal from "../components/modals";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: 'manager' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageData, setMessageData] = useState({ recipient_id: null, subject: '', body: '' });
  const [messageStatus, setMessageStatus] = useState('');

  const fetchManagers = async () => {
    try {
      const response = await getUsers();
      setManagers(response.data.filter(user => user.role === 'manager'));
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleOpenModal = (user = null) => {
    setIsEditing(!!user);
    setCurrentUser(user ? { ...user, password: '' } : { username: '', email: '', password: '', role: 'manager' });
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
    fetchManagers();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
      fetchManagers();
    }
  };

  const handleOpenMessageModal = (manager) => {
    setMessageData({ recipient_id: manager.id, subject: '', body: '' });
    setMessageStatus('');
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => setIsMessageModalOpen(false);
  const handleMessageChange = (e) => setMessageData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await sendMessage(messageData);
      setMessageStatus(response.message);
      setTimeout(() => handleCloseMessageModal(), 2000);
    } catch (error) {
      setMessageStatus(error.response?.data?.error || "Failed to send.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Manage Managers</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Manager
        </button>
      </div>
      <ul className="space-y-2">
        {managers.map((m) => (
          <li key={m.id} className="bg-white shadow p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{m.username}</p>
              <p className="text-sm text-gray-500">{m.email}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleOpenMessageModal(m)} className="text-sm bg-green-500 text-white px-3 py-1 rounded">Message</button>
              <button onClick={() => handleOpenModal(m)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Manager" : "Add Manager"}>
        {/* ... (Add/Edit form is unchanged) ... */}
      </Modal>
      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={`Send In-App Message`}>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <input type="text" name="subject" placeholder="Subject" value={messageData.subject} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required />
          <textarea name="body" rows="4" placeholder="Your message..." value={messageData.body} onChange={handleMessageChange} className="w-full p-2 border rounded-lg" required></textarea>
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