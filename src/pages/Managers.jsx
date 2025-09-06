import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { sendMessage } from "../api/messageApi"; // Use the new message API
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

  const handleOpenModal = (user = null) => { /* ... (function is unchanged) */ };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { /* ... (function is unchanged) */ };
  const handleDelete = async (id) => { /* ... (function is unchanged) */ };

  const handleOpenMessageModal = (manager) => {
    setMessageData({ recipient_id: manager.id, subject: '', body: '' }); // Store the manager's ID
    setMessageStatus('');
    setIsMessageModalOpen(true);
  };

  const handleMessageChange = (e) => {
    setMessageData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await sendMessage(messageData);
      setMessageStatus(response.message);
      setTimeout(() => setIsMessageModalOpen(false), 2000);
    } catch (error) {
      setMessageStatus(error.response?.data?.error || "Failed to send.");
    }
  };

  return (
    <div className="p-4">
      {/* ... (Header and list are the same) ... */}
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
      {/* ... (Add/Edit Manager Modal is unchanged) ... */}

      {/* Send Message Modal */}
      <Modal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title={`Send Message to ${currentUser.username}`}>
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