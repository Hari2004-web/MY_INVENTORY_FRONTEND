import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import Modal from "../components/modals";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: 'manager' });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleChange = (e) => {
    setCurrentUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Managers</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Manager
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {managers.map((m) => (
            <li key={m.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{m.username}</p>
                <p className="text-sm text-gray-600">{m.email}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(m)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Manager" : "Add Manager"}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={currentUser.username} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
          <input type="email" name="email" placeholder="Email" value={currentUser.email} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
          {!isEditing && (
            <input type="password" name="password" placeholder="Password" value={currentUser.password} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
          )}
          <input type="hidden" name="role" value="manager" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
            {isEditing ? "Save Changes" : "Create Manager"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Managers;